output "instance_ip" {
  description = "IP pública de la instancia"
  value       = google_compute_address.static_ip.address
}

output "instance_name" {
  value = google_compute_instance.backend.name
}