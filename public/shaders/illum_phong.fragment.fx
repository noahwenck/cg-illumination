#version 300 es
precision mediump float;

// Input
in vec3 model_normal;
in vec3 FragPos;
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

    vec3 illum_a = ambient;

    vec3 v = normalize(camera_position - FragPos);

    vec3 illum_b_total = vec3(0, 0, 0);
    vec3 illum_s_total = vec3(0, 0, 0);
    
    for (int i = 0; i < num_lights; i++){
        vec3 l = normalize(light_positions[i] - FragPos);
        vec3 illum_b = light_colors[i] * max(dot(n, l), 0.0);

        vec3 r = normalize(reflect(-l, n));
        vec3 illum_s = light_colors[i] * mat_specular * pow(max((dot(r, v)), 0.0) , mat_shininess);

        illum_b_total += illum_b;
        illum_s_total += illum_s;

    }
   

    // FragColor = vec4(mat_color * texture(mat_texture, model_uv).rgb, 1.0);

    FragColor = vec4((illum_a + illum_b_total)* mat_color * texture(mat_texture, model_uv).rgb + illum_s_total, 1.0);
}
