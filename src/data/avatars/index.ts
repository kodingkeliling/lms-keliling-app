// Daftar avatar hewan dari folder /public/avatar/
// avatarId null = belum memilih (new user) → trigger picker modal

export interface AnimalAvatar {
  id: string;
  label: string;
  url: string;
}

export const ANIMAL_AVATARS: AnimalAvatar[] = [
  { id: "cat",     label: "Kucing",    url: "/avatar/cat.png"     },
  { id: "dog",     label: "Anjing",    url: "/avatar/dog.png"     },
  { id: "duck",    label: "Bebek",     url: "/avatar/duck.png"    },
  { id: "eagle",   label: "Elang",     url: "/avatar/eagle.png"   },
  { id: "gorilla", label: "Gorila",    url: "/avatar/gorilla.png" },
  { id: "lion",    label: "Singa",     url: "/avatar/lion.png"    },
  { id: "panda",   label: "Panda",     url: "/avatar/panda.png"   },
];

/** Ambil URL avatar berdasarkan avatarId. Null/undefined → ambil random. */
export function getAvatarUrl(avatarId?: string | null): string {
  if (avatarId) {
    if (avatarId.startsWith("/avatar/")) return avatarId;
    const found = ANIMAL_AVATARS.find((a) => a.id === avatarId || a.url === avatarId);
    if (found) return found.url;
  }
  // random untuk existing users yang belum punya avatarId
  return ANIMAL_AVATARS[Math.floor(Math.random() * ANIMAL_AVATARS.length)].url;
}

export function getAvatarById(avatarId?: string | null): AnimalAvatar {
  return ANIMAL_AVATARS.find((a) => a.id === avatarId) ?? ANIMAL_AVATARS[0];
}
