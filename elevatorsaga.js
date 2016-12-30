{
    init: function(elevators, floors) {
        elevators.forEach(function(elevator, index) {
            elevator.on("idle", function() {
                elevator.goToFloor(0);
            });

            elevator.on("floor_button_pressed", function(floorNum) {
                if (elevator.destinationQueue.indexOf(floorNum) == -1) { elevator.goToFloor(floorNum); }
                // TODO: Sort queue
            });

            elevator.on("passing_floor", function(floorNum, direction) {
                if (elevator.loadFactor() <= 0.7) {
                    if (direction == "up" && floors[floorNum].requestedUp) { elevator.goToFloor(floorNum, true); }
                    if (direction == "down" && floors[floorNum].requestedDown) { elevator.goToFloor(floorNum, true); }
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
                floors.filter(function(f) { return f.requestedUp || f.requestedDown; }).pop();
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