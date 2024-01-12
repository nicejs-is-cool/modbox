export default class SocketIOLoader {
    name = "SocketIOLoader"
    id = "tk.nicejsiscool.modbox.mods.socketioloader"
    author = "nicejs-is-cool"
    description = "Mod to easily load any Socket.IO version"
    version = "0.1.0"
    enable() {
        return true;
    }
    disable() {
        return false;
    }
    Load(version) {
        return import(`https://esm.sh/socket.io-client@${version}`).then(x => x.default);
    }
}