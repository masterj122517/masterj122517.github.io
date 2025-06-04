---
title: remaps in macOS
date: 2025-05-29
tags: [nvim, remaps]
---

Here there, it's me again

when i was using *Arch Linux*(BTW, i use arch), i copy a remap config from [Luke Smith](https://github.com/LukeSmithxyz) called [remaps](https://github.com/LukeSmithxyz/voidrice/tree/master/.local/bin/remaps) which switchs the mod key and Caps-Lock

However, What interesting is, he makes the Caps-Lock having two functions  

When Press long, it's mod key  

When tap, it's esc  

I really like that feature since it helps me to avoid RSI  

However, When I switched to Mac, I don't really know how to do that

Therefore, I map Caps-Lock to Ctrl and make Ctrl+[ to esc 

It's nice, but i still miss the old one-tap esc

However, One Day i scroll through the reddit or something, I find a post that shows me karabiner-elements could do that  

I'm thrilled. Quickly find a online mapping to do that  

Now, Let's me show you how to do that

First, You need to install karabiner-elements of course

You can download from their [website](https://karabiner-elements.pqrs.org/)  
or using homebrew 
```
brew install --cask karabiner-elements
``` 


Next, You open karabiner-elements and find **complex modifications** 

There's a "Add predefined rule" button, click it, you will find "import more rules from the internet"

It will opens your browser and after that, search for "Caps Lock to esc and Ctrl"  

After that you would find a result by *@brycekbargar*. imports it and enable it, everything is good

Or.....

You can just add your own rule

```
{
    "description": "Caps Lock to Esc and Ctrl",
    "manipulators": [
        {
            "from": {
                "key_code": "caps_lock",
                "modifiers": { "optional": ["any"] }
            },
            "to": [{ "key_code": "right_control" }],
            "to_if_alone": [{ "key_code": "escape" }],
            "type": "basic"
        }
    ]
}
```

add this rule by yourself is the same

I will also recommand to switch right option and command, so if you using window manager like yabai or aerospace, it's easier to switch between the windows  

There's a trick in yabai, you can bind your mod key to left_option, that way in some apps like tmux, you would be able to use the alt key using right option without confliction  

Here is some rules i use, you might find them useful

Swap Right Command and Right Option for all keyboards.
```
{
    "description": "Swap Right Command and Right Option for all keyboards.",
    "manipulators": [
        {
            "from": { "key_code": "right_command" },
            "to": [{ "key_code": "right_option" }],
            "type": "basic"
        },
        {
            "from": { "key_code": "right_option" },
            "to": [{ "key_code": "right_command" }],
            "type": "basic"
        }
    ]
}
```

Map ctrl + [ to escape
```
{
    "description": "Map ctrl + [ to escape",
    "manipulators": [
        {
            "from": {
                "key_code": "open_bracket",
                "modifiers": {
                    "mandatory": ["control"],
                    "optional": ["any"]
                }
            },
            "to": [{ "key_code": "escape" }],
            "type": "basic"
        }
    ]
}
```
Change Fn + h/j/k/l to Arrows
```
{
    "description": "Change Fn + h/j/k/l to Arrows",
    "manipulators": [
        {
            "from": {
                "key_code": "h",
                "modifiers": {
                    "mandatory": ["fn"],
                    "optional": ["caps_lock"]
                }
            },
            "to": [{ "key_code": "left_arrow" }],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "j",
                "modifiers": {
                    "mandatory": ["fn"],
                    "optional": ["caps_lock"]
                }
            },
            "to": [{ "key_code": "down_arrow" }],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "k",
                "modifiers": {
                    "mandatory": ["fn"],
                    "optional": ["caps_lock"]
                }
            },
            "to": [{ "key_code": "up_arrow" }],
            "type": "basic"
        },
        {
            "from": {
                "key_code": "l",
                "modifiers": {
                    "mandatory": ["fn"],
                    "optional": ["caps_lock"]
                }
            },
            "to": [{ "key_code": "right_arrow" }],
            "type": "basic"
        }
    ]
}
```

karabiner-elements is a really nice mapping tool in macOS, Hope you find a great way to config your own mapping
