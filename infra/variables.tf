variable "project_id" {
  description = "ID del proyecto de GCP"
  type        = string
  default     = "project-f50a094d-d02b-40c5-b0d"
}

variable "region" {
  description = "Región del Always Free tier"
  type        = string
  default     = "us-east1"
}

variable "zone" {
  description = "Zona dentro de la región Always Free"
  type        = string
  default     = "us-east1-b"
}

variable "instance_name" {
  description = "Nombre de la instancia"
  type        = string
  default     = "portfolio-backend"
}

variable "ssh_pub_key_path" {
  description = "Ruta a tu llave pública SSH"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}