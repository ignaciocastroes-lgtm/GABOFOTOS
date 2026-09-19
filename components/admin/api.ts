/** Llamada al servidor del panel: si la sesión venció, manda al login; si falla, lanza el mensaje del servidor. */
export async function api<T>(ruta: string, init?: RequestInit): Promise<T> {
  const res = await fetch(ruta, init)
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    window.location.assign("/admin/login")
    throw new Error("La sesión venció. Vuelve a entrar.")
  }
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Algo salió mal.")
  return data as T
}
