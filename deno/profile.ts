/**
 * https://minecraft.wiki/w/Mojang_API#Query_player%27s_skin_and_cape
 */
export const getProfile = async (uuid: string): Promise<{
  readonly name: string;
  readonly properties: ReadonlyArray<{
    readonly name: "textures" | string;
    readonly value: string;
  }>;
}> => {
  return await (await fetch(
    `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`,
  )).json();
};
