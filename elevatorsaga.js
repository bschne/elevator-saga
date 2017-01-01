{
    init: function(elevators, floors) {
        elevators.forEach(function(elevator, index) {
            
            elevator.on("floor_button_pressed", function(floorNum) {
                if (elevator.destinationQueue.indexOf(floorNum) == -1) { elevator.goToFloor(floorNum); }
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                // Pick up passengers on the floor if there is room
                if (elevator.loadFactor() <= 0.7) {
                    if (direction == "up" && floors[floorNum].requestedUp) { elevator.goToFloor(floorNum, true); }
                    if (direction == "down" && floors[floorNum].requestedDown) { elevator.goToFloor(floorNum, true); }
                }

                // Stop at the floor first if it is in the queue
                if (elevator.destinationQueue.indexOf(floorNum) != -1) { 
                    elevator.destinationQueue.splice(elevator.destinationQueue.indexOf(floorNum), 1);
                    elevator.goToFloor(floorNum, true); 
                }
            });

            elevator.on("stopped_at_floor", function(floorNum) {
                if (elevator.destinationDirection() == "up") {
                    floors[floorNum].requestedUp = false;
                } else {
                    floors[floorNum].requestedDown = false;
                }
            });

            elevator.on("idle", function() {
                var requestedFloors = floors.filter(function(f) { return f.requestedUp || f.requestedDown; });
                var distances = requestedFloors.map(function(f) { return Math.abs(f.floorNum() - elevator.currentFloor()); });
                var floorIndex = Math.min.apply(null, distances);
                
                if (requestedFloors[floorIndex]) {
                    var floorNum = requestedFloors[floorIndex].floorNum();

                    floors[floorNum].requestedUp = false;
                    floors[floorNum].requestedDown = false;
                    elevator.goToFloor(floorNum);
                } else {
                    elevator.goToFloor(0);
                }
            })
        });

        floors.forEach(function(floor, index) {
            floor.requestedUp = false;
            floor.requestedDown = false;

            floor.on("up_button_pressed", function() {
                floor.requestedUp = true;
            });

            floor.on("down_button_pressed", function() {
                floor.requestedDown = true;
            });
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}