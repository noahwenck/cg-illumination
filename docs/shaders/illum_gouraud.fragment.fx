#version 300 es
precision mediump float;

// Input
in vec2 model_uv;
in vec3 diffuse_illum;
in vec3 specular_illum;

// Uniforms
// material
uniform vec3 mat_color;
uniform vec3 mat_specular;
uniform sampler2D mat_texture;
// light from environment
uniform vec3 ambient; // Ia

// Output
out vec4 FragColor;

void main() {
    vec3 model_color = mat_color * texture(mat_texture, model_uv).rgb;

    vec3 dIllum = diffuse_illum * model_color;
    vec3 sIllum = specular_illum * mat_specular;
    vec3 aIllum = ambient * model_color;

    FragColor = vec4(aIllum + dIllum + sIllum, 1.0);
}
