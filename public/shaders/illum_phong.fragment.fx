#version 300 es
precision mediump float;

// Input
in vec3 model_normal;
in vec2 model_uv;

// Uniforms
// material
uniform vec3 mat_color;
uniform vec3 mat_specular;
uniform float mat_shininess;
uniform sampler2D mat_texture;
// camera
uniform vec3 camera_position;
// lights
uniform vec3 ambient; // Ia
uniform int num_lights;

uniform vec3 light_positions[8];
uniform vec3 light_colors[8]; // Ip 

// Output
out vec4 FragColor;

void main() {
    // Color
    // vec3 mat_color = light_colors * mat_color;
    vec3 n = normalize(model_normal);
    vec3 l = normalize(light_positions[0]);

    vec3 illum_a = ambient;
    vec3 illum_b = light_colors[0] * max(dot(n, l), 0.0);

    vec3 r = (2.0 * (max(dot(n, l), 0.0)) * n) - l;
    vec3 v = normalize(camera_position);

    vec3 illum_s = mat_specular * pow(max((dot(r, v)), 0.0) , mat_shininess);

    FragColor = vec4(mat_color * texture(mat_texture, model_uv).rgb, 1.0);

    FragColor = vec4((illum_a + illum_b + illum_s)* mat_color * texture(mat_texture, model_uv).rgb, 1.0);
}
