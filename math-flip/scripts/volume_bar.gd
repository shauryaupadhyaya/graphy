extends HScrollBar

var bus_index: int
var current_value: float
func _ready() -> void:
	bus_index = AudioServer.get_bus_index("Master")
	value_changed.connect(_on_value_changed)
	current_value = AudioServer.get_bus_volume_db(bus_index)
	value = current_value
	
func _on_value_changed(new_value: float) -> void:
	AudioServer.set_bus_volume_db(bus_index, linear_to_db(new_value))
