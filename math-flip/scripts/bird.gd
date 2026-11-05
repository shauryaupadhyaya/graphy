extends CharacterBody2D

@onready var bird: AnimatedSprite2D = $Bird
# todo: make bird turn up when keyboard press
@export var gravity: float = 900
@export var jump_force: float = -350
func _input(event: InputEvent) -> void:
	if event.is_action_pressed("space"):
		self.rotation_degrees = -20
		pass

func _physics_process(delta: float) -> void:
	velocity.y += delta * gravity
	if Input.is_action_just_pressed("space") or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT):
		velocity.y = jump_force
	if velocity.y > 0:
		self.rotation = lerp_angle(self.rotation, deg_to_rad(90), delta * 2)
	else:
		self.rotation = lerp_angle(self.rotation, deg_to_rad(-90), delta * 2)
	move_and_slide()
