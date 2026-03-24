# Subnet group for ElastiCache (needs to span at least 2 AZs)
resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project}-${var.environment}-redis-subnet-group"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${var.project}-${var.environment}-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.1"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.db_sg.id]

  tags = {
    Environment = var.environment
    Project     = var.project
  }
}
