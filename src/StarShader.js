import { Color, Vector3 } from 'three';

export const StarShader = {
  uniforms: {
    colorMap: {
      value: [
        new Color("#FFFF00"), // Bright yellow
        new Color("#FFD700"), // Gold
        new Color("#FFA500"), // Orange
        new Color("#FF8C00"), // Dark orange
      ],
    },
    brightnessThresholds: {
      value: [0.9, 0.45, 0.001],
    },
    lightPosition: { value: new Vector3(15, 15, 15) },
  },
  vertexShader: /* glsl */ `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normal;
      vPosition = position;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;

    uniform mat4 modelMatrix;

    uniform vec3 colorMap[4];
    uniform float brightnessThresholds[3];
    uniform vec3 lightPosition;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vec3 worldPosition = (modelMatrix * vec4(vPosition, 1.0)).xyz;
      vec3 worldNormal = normalize(vec3(modelMatrix * vec4(vNormal, 0.0)));
      vec3 lightVector = normalize(lightPosition - worldPosition);
      float brightness = dot(worldNormal, lightVector);

      vec4 final;

      if (brightness > brightnessThresholds[0])
        final = vec4(colorMap[0], 1);
      else if (brightness > brightnessThresholds[1])
        final = vec4(colorMap[1], 1);
      else if (brightness > brightnessThresholds[2])
        final = vec4(colorMap[2], 1);
      else
        final = vec4(colorMap[3], 1);

      gl_FragColor = vec4(final);
    }`,
};