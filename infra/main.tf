# ── Red y firewall ──────────────────────────────────────────────
resource "google_compute_network" "vpc" {
  name                    = "portfolio-vpc"
  auto_create_subnetworks = true
}

resource "google_compute_firewall" "allow_ssh" {
  name    = "allow-ssh"
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["portfolio-backend"]
}

resource "google_compute_firewall" "allow_http_https" {
  name    = "allow-http-https"
  network = google_compute_network.vpc.name

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["portfolio-backend"]
}

# ── IP externa estática ──────────────────────────────────────────
# Es gratis SOLO mientras esté asignada a una instancia en ejecución.
# Si la desasocias (o apagas la VM por mucho tiempo), empieza a cobrar.
resource "google_compute_address" "static_ip" {
  name   = "portfolio-backend-ip"
  region = var.region
}

# ── Instancia e2-micro (Always Free) ─────────────────────────────
resource "google_compute_instance" "backend" {
  name         = var.instance_name
  machine_type = "e2-micro"
  zone         = var.zone
  tags         = ["portfolio-backend"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 30 # GB — dentro del límite del Always Free
      type  = "pd-standard"
    }
  }

  network_interface {
    network = google_compute_network.vpc.name

    access_config {
      nat_ip = google_compute_address.static_ip.address
    }
  }

  metadata = {
    ssh-keys = "diegoall:${file(var.ssh_pub_key_path)}"
  }

  metadata_startup_script = file("${path.module}/startup.sh")
}