resource "helm_release" "kube_prometheus_stack" {
  name             = "kube-prometheus-stack"
  repository       = "https://prometheus-community.github.io/helm-charts"
  chart            = "kube-prometheus-stack"
  namespace        = "monitoring"
  create_namespace = true
  version          = "58.3.1"

  set {
    name  = "grafana.adminPassword"
    value = var.grafana_admin_password
  }

  # Enable ServiceMonitor support so Prometheus picks up our k8s/servicemonitor.yaml
  set {
    name  = "prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues"
    value = "false"
  }

  # Persist Grafana dashboards across restarts
  set {
    name  = "grafana.persistence.enabled"
    value = "true"
  }

  depends_on = [aws_eks_node_group.main]
}
