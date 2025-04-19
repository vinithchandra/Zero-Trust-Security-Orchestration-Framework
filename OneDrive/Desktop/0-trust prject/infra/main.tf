# Terraform root module for Zero-Trust Framework
# This file includes modules for EKS, Vault, Istio, and supporting infrastructure

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">= 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = var.cluster_name
  cluster_version = "1.28"
  subnets         = var.subnets
  vpc_id          = var.vpc_id
  manage_aws_auth = true
}

module "vault" {
  source = "./modules/vault"
  eks_cluster_name = module.eks.cluster_name
}

module "istio" {
  source = "./modules/istio"
  eks_cluster_name = module.eks.cluster_name
}

# Add more modules as needed
