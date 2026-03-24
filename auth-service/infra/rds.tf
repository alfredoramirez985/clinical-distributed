# Subnet group for RDS (needs to span at least 2 AZs)
resource "aws_db_subnet_group" "postgres" {
  name       = "${var.project}-${var.environment}-db-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "${var.project}-${var.environment}-postgres"

  engine         = "postgres"
  engine_version = "17"
  instance_class = "db.t3.micro"

  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true

  db_name  = "authdb"
  username = "firstuser"
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.postgres.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]

  # Backups and availability
  backup_retention_period = 7
  multi_az                = false # set to true for production
  skip_final_snapshot     = true  # set to false for production

  deletion_protection = false # set to true for production

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}
