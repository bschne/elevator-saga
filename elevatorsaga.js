{
    init: function(elevators, floors) {
        var floorQueue = [];
        
        var FloorCall = function(floorNum, direction) {
            this.floorNum = floorNum;
            this.direction = direction;
        }

        // Set up functions

        // Schedules an elevator to go to a new floor after its other floors
        var scheduleStop = function(elevator, floorNum) {
        	var elevatorQueueIndex = elevator.destinationQueue.indexOf(floorNum);
        	if(elevatorQueueIndex !== -1) {
        		elevator.destinationQueue.splice(elevatorQueueIndex, 1);
        	}

        	// Remove floor from floorQueue
            floorQueue = floorQueue.filter(function(e) {
                return (e.floorNum !== floorNum) || (e.direction !== elevator.destinationDirection);
            });

        	elevator.destinationQueue.push(floorNum);
        	elevator.checkDestinationQueue();

            updateElevatorIndicator(elevator);
        }

        // Reschedules an elevator to go to a new floor first
        var rescheduleStop = function(elevator, floorNum) {
            elevators.forEach(function(ele) {
                var elevatorQueueIndex = ele.destinationQueue.indexOf(floorNum);
                if(elevatorQueueIndex !== -1) {
                    ele.destinationQueue.splice(elevatorQueueIndex, 1);
                }
            });

    		// Remove floor from floorQueue
            floorQueue = floorQueue.filter(function(e) {
                return (e.floorNum !== floorNum) || (e.direction !== elevator.destinationDirection);
            });

    		// Add floor to the beginning of the queue
    		elevator.destinationQueue.unshift(floorNum);
    		elevator.checkDestinationQueue();

            updateElevatorIndicator(elevator);
        }

        // Updates the up-/down-indicators on an elevator depending on its direction
        var updateElevatorIndicator = function(elevator) {
            // Set elevator indicator
            if(elevator.destinationDirection() === "up") {
                console.log("Setting indicators to up");
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            } else if(elevator.destinationDirection() === "down") {
                console.log("Setting indicators to down");
                elevator.goingUpIndicator(false);
                elevator.goingDownIndicator(true);
            } else {
                // Elevator is stopped, so it should be on the ground floor for now
                console.log("Turning indicators to up (ground floor / idle)");
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            }
        }

        // Set up elevator behaviour
        elevators.forEach(function(elevator) {

        	// Handle floor button presses
	        elevator.on("floor_button_pressed", function(floorNum) {
	        	scheduleStop(elevator, floorNum);
	        });

	        // Whenever the elevator is idle (has no more queued destinations) ...
	        elevator.on("idle", function() {
                var floorNum = floorQueue.length > 0 ? floorQueue.shift().floorNum : 0;
	            scheduleStop(elevator, floorNum);
	        });

	        elevator.on("passing_floor", function(floorNum, direction) {
	        	// If someone is waiting, reschedule a stop at the next floor 
	        	// if the direction is right and the elevator isn't full
	        	if(floorQueue.filter(function(e) { return e.floorNum === floorNum && direction === elevator.destinationDirection() }).length > 0 &&
	        	   elevator.loadFactor() <= 0.8) {
	        		rescheduleStop(elevator, floorNum);
	        	}
	        });

            elevator.on("stopped_at_floor", function(floorNum) {
                // Set indicators if elevator is at top or bottom floor
                if(floorNum === 0) {
                    elevator.goingUpIndicator(true);
                    elevator.goingDownIndicator(false);
                } else if(floorNum === floors.length - 1) {
                    elevator.goingUpIndicator(false);
                    elevator.goingDownIndicator(true);
                }
            });
        });

        // Set up floor behaviour
        floors.forEach(function(floor) {
        	floor.on("up_button_pressed", function() { 
                if (floorQueue.filter(function(e) { return (e.floorNum === floor.floorNum) && (e.direction === "up") }).length === 0) {
                    floorQueue.push(new FloorCall(floor.floorNum(), "up"));
                }
        	});

        	floor.on("down_button_pressed", function() { 
        		if (floorQueue.filter(function(e) { return (e.floorNum === floor.floorNum) && (e.direction === "down") }).length === 0) {
                    floorQueue.push(new FloorCall(floor.floorNum(), "down"));
                }
        	});
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}