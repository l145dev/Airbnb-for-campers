const isHost = async (user_id, prisma) => {
    const owner = await prisma.users.findUnique({
        where: {
            user_id: user_id,
            is_owner: true
        }
    })

    // is owner
    if (owner) {
        return true;
    }

    return false
}

export default isHost;