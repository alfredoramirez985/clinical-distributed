variable "aws_region" {
  description = "AWS region to deploy to"
  default     = "us-east-1"
}

variable "project" {
  description = "Name of the project"
  default     = "clinical-distributed"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  default     = "dev"
}

variable "db_password" {
  description = "Password for the master DB user"
  type        = string
  sensitive   = true
}
