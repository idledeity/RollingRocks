
/**
 * The particle field is a class that manages a field of particles over a specified area
 */
class ParticleField extends Layer {
    /**
     * Constructor
     * @param {*} gameWorld - The game world this layer is a part of
     * @param {*} layerDefinition  - Definition for this layer
     */
    constructor(gameWorld, definition) {
        super(gameWorld, definition);

        let particleInfo = this.definition.particleInfo;
        
        // Calculate the surface area of the layer and the desired coverage area
        let surfaceArea = this.definition.width * this.definition.height;
        let coverageArea = surfaceArea * particleInfo.coverage;

        // Create the particlles
        this.particles = []
        for(let coveredArea = 0; coveredArea < coverageArea;) {
            let newParticle = {};

            // Calculate the particle's scale
            let scaleX = Math.floor(Math.random() * (particleInfo.scaleXMax - particleInfo.scaleXMin) + particleInfo.scaleXMin);
            let scaleY = Math.floor(Math.random() * (particleInfo.scaleYMax - particleInfo.scaleYMin) + particleInfo.scaleYMin);

            // Create the image for this particle
            newParticle.startX = Math.floor(Math.random() * (this.definition.width - scaleX));
            newParticle.startY = Math.floor(Math.random() * (this.definition.height - scaleY));
            let image = particleInfo.images[Math.floor(Math.random() * particleInfo.images.length)];
            newParticle.sprite = this.group.create(newParticle.startX, newParticle.startY, image);

            // Set the scale
            newParticle.sprite.scale.setTo(scaleX, scaleY);

            // Set the tint
            let colorString = particleInfo.colors[Math.floor(Math.random() * particleInfo.colors.length)];
            newParticle.sprite.tint = parseInt(colorString);

            // Create a depth offset for this particle
            newParticle.displacementMultX = Math.random() * (particleInfo.displacementMultXMax - particleInfo.displacementMultXMin) + particleInfo.displacementMultXMin;
            newParticle.displacementMultY = Math.random() * (particleInfo.displacementMultYMax - particleInfo.displacementMultYMin) + particleInfo.displacementMultYMin;

            // Store a reference to the new particle
            this.particles.push(newParticle);

            // Update the covered area
            coveredArea = coveredArea + (scaleX * scaleY);
        }
    }

    /**
     * Per-frame update function for the layer
     */
    update() {
        super.update();

        let displacementX = this.group.x - this.definition.position.x;
        let displacementY = this.group.y - this.definition.position.y;

        // Update the particles
        for (let particleIdx = 0; particleIdx < this.particles.length; particleIdx++) {
            let particle = this.particles[particleIdx];
            particle.sprite.x = Math.floor(particle.startX + (displacementX * particle.displacementMultX));
            particle.sprite.y = Math.floor(particle.startY + (displacementY * particle.displacementMultY));
        }
    }
}