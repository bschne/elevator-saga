{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator

        // Handle floor button presses
        elevator.on("floor_button_pressed", function(floorNum) {
        	elevator.goToFloor(floorNum);
        });

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            elevator.goToFloor(0);
            elevator.goToFloor(1);
            elevator.goToFloor(2);
            elevator.goToFloor(3);
            elevator.goToFloor(4);
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}