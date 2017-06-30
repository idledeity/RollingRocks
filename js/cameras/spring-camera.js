
/**
 * The spring camera uses a modified dampened spring simulation to attach a camera to a target object to follow
 */
class SpringCamera extends GameCamera {
    /**
     * Constructor
     * @param {GameWorld} gameWorld - The game world the camera will use
     * @param {Number} x - X coordinate of camera in world space
     * @param {Number} y - Y coordinate of camera in world space
     */
    constructor(gameWorld, x, y) {
        super(gameWorld, x, y);

        // Initialize the spring parameters
        this.springDeactivateDistance = 5.0; // if the camera is this close to the target, the spring should be inactive
        this.springActivateDistance = 25.0;  // if the camera is this far away from the target, the spring should be active
        this.springActivateSpeed = 0.1;      // if the camera speed is above this threshold, t he spring should be active
        this.maxFollowDistance = 150.0;      // the maximum distance the camera can get from the target 
        this.springConstant = 150;           // the spring constant (k) that controls the amount force the spring applied to the camera while active
        this.dampeningConstant = 0.025;      // the dampening constant {w0} that controls the resistance of the camera to move providing a constant "slowing" force (aka friction)

        this.velocity = Matter.Vector.create(0, 0);
    }

    /**
     * Per-frame update for the camera
     * @param {Number} deltaTimeMS - The elapsed time from the previous simulation frame in milliseconds
     */
    update(deltaTimeMS) {
        // Update the camera to follow the target
        if (this.followTarget != null) {
            // Calculate the displacement, magnitude, and direction between the current camera position and the follow target position
            let targetPos = Matter.Vector.clone(this.followTarget.rigidBody.position);
            let displacement = Matter.Vector.sub(targetPos, this.cameraPos);
            let distance = Matter.Vector.magnitude(displacement);
            let direction = Matter.Vector.div(displacement, distance);

            // Check if the camera is within the spring deactivate distance
            if (distance <= this.springDeactivateDistance) {
                // Just zero the velocity, and leave the camera position untouhed
                this.velocity.x = 0;
                this.velocity.y = 0;
            } else {
                let speedPrev = Matter.Vector.magnitude(this.velocity);
                
                // If the previous camera speed is above the activation threshold or the position is outside the activation range, activate the spring
                if (speedPrev > this.springActivateSpeed || distance >= this.springActivateDistance) {
                    // Check the direction between the target position and the previous camera velocity
                    if (Matter.Vector.dot(direction, this.velocity) < 0) {
                        // If the camera direction changed, negate the previous speed
                        speedPrev *= -1.0;
                    }

                    // Calculate a new speed based off the previous spreed, and the spring constant and dampening
                    let deltaTimeSec = deltaTimeMS * 0.001;
                    let speed = (speedPrev * (1 - this.dampeningConstant) + distance * this.springConstant) * deltaTimeSec;

                    // Generate a new velocity vector from the updated speed, always directly towards the target
                    this.velocity = Matter.Vector.mult(direction, speed);

                    // Update the new camera position
                    this.cameraPos = Matter.Vector.add(this.cameraPos, Matter.Vector.mult(this.velocity, deltaTimeSec));

                    // Do a final check to see if the camera position is outside of the max follow range
                    let newDistance = Matter.Vector.magnitude(Matter.Vector.sub(targetPos, this.cameraPos));
                    if (newDistance > this.maxFollowDistance) {
                        // Move the camera position to the max follow radius and use the follow target's velocity for the camera's velocity
                        this.cameraPos = Matter.Vector.sub(targetPos, Matter.Vector.mult(direction, this.maxFollowDistance));
                        this.velocity = Matter.Vector.clone(this.followTarget.rigidBody.velocity);
                    }
                }
            }
        }
    }

    /**
     * Sets the follow target that the spring camera will "spring" towards
     * @param {GameObject} gameObject - The game object for the camera to follow 
     */
    setFollowTarget(gameObject) {
        this.followTarget = gameObject;
    }
}