#version 300 es
precision highp float;

// Attributes
in vec3 position;
in vec2 uv;

// Uniforms
// projection 3D to 2D
uniform mat4 world;
uniform mat4 view;
uniform mat4 projection;
// height displacement
uniform vec2 ground_size;
uniform float height_scalar;
uniform sampler2D heightmap;
// material
uniform vec2 texture_scale;

// Output
out vec3 FragPos;
out vec3 model_normal;
out vec2 model_uv;

void main() {
    // Get initial position of vertex (prior to height displacement)
    mat3 normTransform = inverse(transpose(mat3(world)));

    vec4 world_pos = world * vec4(position, 1.0);

    // Height Displacement
    float gray = texture(heightmap, uv).r;
    float d = 2.0 * height_scalar * (gray - 0.5);
    world_pos.y += d;
    vec3 p = vec3(world_pos);
//From here is the problem section

    //vec3 up = vec3(uv.x, uv    .y + 1.0/ground_size.y, 0.0);    //these are wrong
    //up = (world_pos.x + 1, NEW HEIGHT DISPLACEMENT VALUE
    vec2 uvUp = vec2(uv.x, uv.y + 1.0/ground_size.x);
    vec2 uvRight = vec2(uv.x + 1.0/ground_size.x, uv.y);
    gray = texture(heightmap, uvUp).r;
    d = 2.0 * height_scalar * (gray - 0.5);
    float worldIncreaseX = 1.0/ground_size.x * texture_scale.x;
    float worldIncreaseY = 1.0/ground_size.x * texture_scale.y;
    vec3 up = vec3(world_pos.x, d, world_pos.z + 1.0);

    gray = texture(heightmap, uvRight).r;
    d = 2.0 * height_scalar * (gray - 0.5);
    vec3 right = vec3(world_pos.x + 1.0, d, world_pos.z);
// To here

    //vec3 right = vec3(uv.x + 1.0/ground_size.x, uv.y, 0.0);
    vec3 tangent = right - p;
    vec3 bitangent = up - p;
    model_normal = -normalize(cross(tangent, bitangent));


    // Pass vertex texcoord onto the fragment shader
    model_uv = uv;

    // Transform and project vertex from 3D world-space to 2D screen-space
    gl_Position = projection * view * world_pos;


    FragPos = position;
    // // Get initial position of vertex (prior to height displacement)
    // vec4 world_pos = world * vec4(position, 1.0);

    // // Pass vertex normal onto the fragment shader
    // model_normal = vec3(0.0, 1.0, 0.0);
    // // Pass vertex texcoord onto the fragment shader
    // model_uv = uv;

    // // Transform and project vertex from 3D world-space to 2D screen-space
    // gl_Position = projection * view * world_pos;
}
