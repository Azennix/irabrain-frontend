const GUEST_SESSION_KEY =
  "irabrain_guest_session_id";

const GUEST_DEVICE_KEY =
  "irabrain_guest_device_id";

function createId(): string {
  const bytes = new Uint8Array(16);

  crypto.getRandomValues(bytes);

  bytes[6] =
    (bytes[6] & 0x0f) | 0x40;

  bytes[8] =
    (bytes[8] & 0x3f) | 0x80;

  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  )
    .join("")
    .replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      "$1-$2-$3-$4-$5"
    );
}

export function getGuestSessionId(): string {
  let sessionId =
    localStorage.getItem(
      GUEST_SESSION_KEY
    );

  if (!sessionId) {
    sessionId = createId();

    localStorage.setItem(
      GUEST_SESSION_KEY,
      sessionId
    );
  }

  return sessionId;
}

export function getGuestDeviceId(): string {
  let deviceId =
    localStorage.getItem(
      GUEST_DEVICE_KEY
    );

  if (!deviceId) {
    deviceId = createId();

    localStorage.setItem(
      GUEST_DEVICE_KEY,
      deviceId
    );
  }

  return deviceId;
}