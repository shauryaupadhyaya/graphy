shader_type canvas_item;

uniform sampler2D screen_texture :
    hint_screen_texture,
    repeat_disable,
    filter_linear;

uniform float blur_amount : hint_range(0.0, 5.0) = 2.0;
uniform float opacity : hint_range(0.0, 1.0) = 0.2;

uniform vec4 tint_color : source_color = vec4(0.2, 0.3, 0.5, 1.0);

void fragment() {
    vec2 pixel_size = SCREEN_PIXEL_SIZE * blur_amount * 3.0;

    vec4 blur = vec4(0.0);

    blur += texture(screen_texture, SCREEN_UV + vec2(-pixel_size.x, 0.0));
    blur += texture(screen_texture, SCREEN_UV + vec2(pixel_size.x, 0.0));
    blur += texture(screen_texture, SCREEN_UV + vec2(0.0, -pixel_size.y));
    blur += texture(screen_texture, SCREEN_UV + vec2(0.0, pixel_size.y));
    blur += texture(screen_texture, SCREEN_UV);

    blur /= 5.0;

    vec3 final_color = mix(blur.rgb, tint_color.rgb, opacity);

    COLOR = vec4(final_color, 1.0);
}