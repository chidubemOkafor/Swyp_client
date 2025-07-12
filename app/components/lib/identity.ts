import { v4 as uuid } from "uuid"

export async function setId() {
    const creatorId = await getId()
    if(!creatorId) {
        await cookieStore.set("id", uuid());
    }
}

export async function getId() {
    return await cookieStore.get("id")
}

export async function clearId()  {
    await cookieStore.delete("id")
}