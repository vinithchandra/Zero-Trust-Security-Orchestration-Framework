variable "aws_region" { default = "us-east-1" }
variable "cluster_name" { default = "zero-trust-eks" }
variable "subnets" { type = list(string) }
variable "vpc_id" { type = string }
