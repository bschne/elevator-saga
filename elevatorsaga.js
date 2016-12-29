{
    init: function(elevators, floors) {
        var floorQueue = [];

        // Set up elevator behaviour
        elevators.forEach(function(elevator) {

        	// Handle floor button presses
	        elevator.on("floor_button_pressed", function(floorNum) {
	        	elevator.destinationQueue.push(floorNum);
	        	elevator.checkDestinationQueue;
	        });

	        // Whenever the elevator is idle (has no more queued destinations) ...
	        elevator.on("idle", function() {
	            elevator.destinationQueue.push(floorQueue.shift() || 0);
	            elevator.checkDestinationQueue();
	        });
        });

        // Set up floor behaviour
        floors.forEach(function(floor) {
        	floor.on("up_button_pressed", function() { 
        		floorQueue.push(floor.floorNum());
        	});

        	floor.on("down_button_pressed", function() { 
        		floorQueue.push(floor.floorNum());
        	});
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}