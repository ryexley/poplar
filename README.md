Wemo Menubar Controller
========================

This is a menubar application for OS X for toggling the state of [Wemo](http://www.belkin.com/us/Products/home-automation/c/wemo-home-automation/) connected devices.

![Screenshot](/screenshots/screenshot-1.png?raw=true "Discovering Devices")
![Screenshot](/screenshots/screenshot-2.png?raw=true "Device List with device turned off")
![Screenshot](/screenshots/screenshot-3.png?raw=true "Device List with device turned on")

---

## Motivation (what is this for?)
I am a remote worker, which means that I most often work from home. Working from home presents some challenges when it comes to privacy and focus when my family and others are also around the house during the day. It not always disruptive if they occasionally pop in or make some noise outside my office when I'm working, but there are times, like when I'm on a video/conference call and need to be able to hear, or when I just need some time to focus, that I need a way to let them know that I need to not be interrupted.

#### The problem
Often when I'm working, video/conference calls happen in a very impromptu manner. Things just come up and I need to hop on a call to interact with a co-worker. This happens often. When it does, it's very disruptive to have to tell my co-workers something like "I'll be right back" while I have to remove my headphones <super>*</super>, get up, and manually flip some sort of sign that indicates that I'm in a meeting and/or should not be disturbed. What I _really_ needed, was some way to be able to flip a switch, directly from my computer, on some sort of signal/indicator (an "On Air" sign, if you will) that is outside of my office that would let everyone know that I'm busy at the moment, and can't be disturbed.

#### The solution
A co-worker of mine, [Elijah Manor](http://elijahmanor.com) ([twitter](https://twitter.com/elijahmanor)) wrote about [his solution to this same challenge as a remote worker](http://elijahmanor.com/wemo-node/). This project is the result of his inspiration. I decided to take his solution a step further and build a fancy UI around it (OK, OK, it's really not all that fancy, but it does exactly what I wanted it to).

## Development

## Building

---

### Credits
OSS FTW!

* [Electron](https://github.com/electron/electron)
* [Electron Menubar](https://github.com/maxogden/menubar)
* [Wemo Client](https://github.com/timonreinhard/wemo-client)
* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [Webpack](https://webpack.github.io/)

---
<super>*</super> I nearly always have my headphones in/on, and, having not found a very reliable set of bluetooth headphones or earbuds yet, this often means that I'm literally tethered to my computer with a wire.
