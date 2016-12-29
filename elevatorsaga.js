{
    init: function(elevators, floors) {
        var floorQueue = [];

        // Set up functions
        var scheduleStop = function(elevator, floorNum) {
        	var elevatorQueueIndex = elevator.destinationQueue.indexOf(floorNum);
        	if(elevatorQueueIndex !== -1) {
        		elevator.destinationQueue.splice(elevatorQueueIndex, 1);
        	}

        	// Remove floor from floorQueue
        	var floorQueueIndex = floorQueue.indexOf(floorNum);
        	if(floorQueueIndex !== -1) {
        		floorQueue.splice(floorQueueIndex, 1);
        	}

        	elevator.destinationQueue.push(floorNum);
        	elevator.checkDestinationQueue();
        }

        var rescheduleStop = function(elevator, floorNum) {
        	// Remove rescheduled floor from Queue if it is already queued
    		var elevatorQueueIndex = elevator.destinationQueue.indexOf(floorNum);
    		if(elevatorQueueIndex !== -1) {
    			elevator.destinationQueue.splice(elevatorQueueIndex, 1);
    		}

    		// Remove floor from floorQueue
        	var floorQueueIndex = floorQueue.indexOf(floorNum);
        	if(floorQueueIndex !== -1) {
        		floorQueue.splice(floorQueueIndex, 1);
        	}

    		// Add floor to the beginning of the queue
    		elevator.destinationQueue.unshift(floorNum);
    		elevator.checkDestinationQueue();
        }

        // Set up elevator behaviour
        elevators.forEach(function(elevator) {

        	// Handle floor button presses
	        elevator.on("floor_button_pressed", function(floorNum) {
	        	scheduleStop(elevator, floorNum);
	        });

	        // Whenever the elevator is idle (has no more queued destinations) ...
	        elevator.on("idle", function() {
	            scheduleStop(elevator, floorQueue.shift() || 0);
	        });

	        elevator.on("passing_floor", function(floorNum, direction) {
	        	// If someone is waiting, reschedule a stop at the next floor 
	        	// if the direction is right and the elevator isn't full
	        	if(direction === elevator.destinationDirection() && 
	        	   floorQueue.indexOf(floorNum) !== -1 &&
	        	   elevator.loadFactor() <= 0.8) {
	        		rescheduleStop(elevator, floorNum);
	        	}
	        });
        });

        // Set up floor behaviour
        floors.forEach(function(floor) {
        	floor.on("up_button_pressed", function() { 
        		if (floorQueue.indexOf(floor.floorNum()) === -1) {
					floorQueue.push(floor.floorNum());
        		}
        	});

        	floor.on("down_button_pressed", function() { 
        		if (floorQueue.indexOf(floor.floorNum()) === -1) {
        			floorQueue.push(floor.floorNum());
        		}
        	});
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}