export default class rmtbMod {
	name = "rmtrollbox"
	author = "nicejs-is-cool"
	description = "Adds rmtrollbox to ducktb"
	version = "1.0.0"
	id = "tk.nicejsiscool.modbox.mods.ducktb.rmtb"
	#tab = null
	socket = null
	async enable() {
		const he = (await import("https://esm.sh/he@1.2.0")).default;
		this.#tab = window.Tab.create("rmtb")
		this.#tab.name = "rmtb#general"
		this.#tab.onMessage = this.handleC2SMessage.bind(this);
		const io = await ModBox.Mods.Get("tk.nicejsiscool.modbox.mods.socketioloader").Load("2.5");
		this.socket = io("https://sussite.tk");
		this.socket.on('message', (msg) => {
			this.#tab.printMsg({sid:msg.sid,time:msg.date,content:he.decode(msg.msg),_user:{sid:msg.sid,home:msg.home,nick:msg.nick,color:msg.color}},true)
		})
		this.socket.on("user joined", d=>this.#tab.printMsg({sid:"system",content:nickHTML(d).outerHTML+" <em>joined",html:true,time:Date.now()}));
		this.socket.on("user left", d=>this.#tab.printMsg({sid:"system",content:nickHTML(d).outerHTML+" <em>left",html:true,time:Date.now()}));
		this.socket.on("user change nick", ([p,n])=>this.#tab.printMsg({sid:"system",content:nickHTML(p).outerHTML+" <em>is now known as</em> "+nickHTML(n).outerHTML,html:true,time:Date.now()}));
		connections.set("rmtb", { sock: this.socket, updateNickname([u, c]) { this.sock.emit("user joined", u, c, "", "") } });
		this.#tab.onClose = () => this.destroy();
		this.socket.on('connect', () => {
			setTimeout(() => this.socket.emit("user joined", username[0], username[1]), 2000);
			this.#tab.canSend = true;
		});
		this.socket.on('disconnect', () => {
			this.#tab.canSend = false;
		});
		this.socket.on('update users', users => {
			this.#tab.updateUsers(Object.entries(users).map(([k,v])=>({sid:k,nick:v.nick,color:v.color,home:v.home})))
		});
		return true;
	}
	handleC2SMessage(msg) {
		this.socket.emit("message",msg);
	}
	disable() {
		this.destroy();
		return true;
	}
	destroy() {
		this.socket.destroy();
		connections.delete('rmtb')
		
	}
}
// this is basically what the @ModBox.Depends does
rmtbMod.prototype.depends = [{modId: "tk.nicejsiscool.modbox.mods.socketioloader", version: "0.1.0"}]