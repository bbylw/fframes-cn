<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/dmtrKovalenko/fframes/raw/main/landing/brand/fframes-wordmark-dark.svg" />
    <img alt="fframes" src="https://github.com/dmtrKovalenko/fframes/raw/main/landing/brand/fframes-wordmark.svg" width="360" />
  </picture>
</p>

<p align="center">
  <b>真正够快的视频氛围编程框架。</b><br />
  用 Rust 和 SVG 编写你的视频，在 GPU 上渲染。
</p>

<p align="center">
  <a href="https://crates.io/crates/fframes"><img alt="crates.io" src="https://img.shields.io/crates/v/fframes.svg" /></a>
  <a href="https://docs.rs/fframes"><img alt="docs.rs" src="https://img.shields.io/docsrs/fframes" /></a>
  <a href="https://github.com/dmtrKovalenko/fframes/blob/main/LICENSE.txt"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <a href="https://x.com/fframes_rust"><img alt="@fframes_rust on X" src="https://img.shields.io/badge/X-@fframes__rust-black.svg" /></a>
</p>

<p align="center">
  <a href="https://fframes.studio"><img alt="The fframes launch video, made with fframes" src="https://github.com/dmtrKovalenko/fframes/raw/main/landing/poster.jpg" width="720" /></a>
</p>

<p align="center">
  <sub>这段 128 秒的视频，用氛围式编程写就花了 48 分钟，渲染花了 36 秒。<br />
  它是一个 fframes 项目：<a href="https://github.com/dmtrKovalenko/fframes/tree/main/examples/fframes-intro">examples/fframes-intro</a>。</sub>
</p>

---

## 让 agent 帮你做视频

fframes 为编程 agent 附带了一个 skill。只需添加一次：

```sh
npx skills add https://fframes.studio
```

然后像向动态设计师下 brief 一样，描述你想要的视频。这个 skill 会带着你的 agent 从一个空文件夹走到渲染好的 `.mp4`：安装 fframes、创建项目、设计动效、置入声音，并在交给你之前检查结果。

fframes 的 API 是显式且详尽的，这也正是它[多年未发布](https://x.com/neogoose_btw/status/2104432563146444994)的原因。编写显式、详尽的代码，正是一个配备了合适 skill 的 agent 擅长的事。

## 为无法观看的作者而打造

编程 agent 无法观看视频，也听不到音轨。每个生成的项目都带有一个命令行，能把视频变成 agent 能读的东西：PNG、文本和数字。

<table>
  <tr>
    <th width="50%">你的 agent</th>
    <th width="50%">你</th>
  </tr>
  <tr>
    <td valign="top">
      <b>不渲染像素也能逐帧检查。</b><br />
      <code>inspect</code> 会报告缺失的字体或图片、被画布裁切的文字、无效的 SVG 以及 panic，每一条都带有其时间和场景。<br /><br />
      <b>查看动效。</b><br />
      <code>strip</code> 把等间距的帧平铺到一张联络表上，<code>onion</code> 混合多帧以展示运动的路径与缓动，<code>frame</code> 写出全尺寸 PNG。<br /><br />
      <b>测量声音。</b><br />
      <code>audio analyze</code> 按场景报告响度（LUFS）、真实峰值、削波和静音。
    </td>
    <td valign="top">
      <b>带声音实时观看。</b><br />
      <code>preview</code> 打开一个 GPU 窗口，可播放、暂停、拖动定位并逐帧步进。<br /><br />
      <b>在浏览器中拖动预览。</b><br />
      编辑器运行编译为 WebAssembly 的视频，并带有时间轴。<br /><br />
      <b>交付。</b><br />
      <code>render</code> 写出最终文件；<code>render --draft</code> 以一半分辨率编码单个场景，约一秒完成。
    </td>
  </tr>
</table>

每条命令都在项目内以 `cargo run --release -- <command>` 运行：

| command | output |
| --- | --- |
| `timeline` | 各场景及其帧范围、秒范围，以及每条音轨及其混音设置 |
| `inspect` | 每 0.25 秒一帧中存在的问题，以及每个场景的首帧和末帧；出错时退出码为 2 |
| `strip <scene> -n 12` | `strip.png`，一张带标注的联络表 |
| `frame <scene>@end,<scene>@50%` | `frames/` 中的全尺寸 PNG |
| `onion "<scene>@0..<scene>@1s" -n 6` | `onion.png`，混合后的运动 |
| `audio analyze --waveform w.png` | 响度报告，以及一张带有场景线和提示刻度的波形图 |
| `snapshot` | 与已批准 PNG 的对比，`.diff.png` 标出变化之处 |
| `preview` | 实时窗口，给人类看 |
| `render [--draft]` | 视频，或其一部分 |

`<scene>` 是你的视频中某个场景结构体的名字。时间可写作 `120`（帧）、`3.2s`、`50%`、`<scene>@1.2s`，以及 `<scene>@0..<scene>@1s` 这样的范围。加上 `--json` 可解析输出。

## 为什么这么快

- **GPU 负责绘制。** Skia 后端在 Metal（macOS）或 Vulkan（Linux、Windows）上渲染，比内置的 CPU 后端快约 10 倍。
- **静态标记被缓存。** 一帧中没有 `{expressions}` 的部分会在编译期被哈希，并由渲染器复用。
- **ffmpeg 负责编码。** fframes 直接链接 ffmpeg 的 libav 库，而不是调用一个独立工具。
- **SVG 不够用时用着色器。** 把 SkSL 或粘贴的 Shadertoy GLSL 作为任意一帧的一个图层来运行。

## 你的 agent 写什么

每一帧都是一个由 Rust 函数返回的 SVG 树，用 `svgr!` 宏编写。来自
[examples/hello-world](https://github.com/dmtrKovalenko/fframes/blob/main/examples/hello-world/src/hello_world.rs)（有删节）：一个方块沿时间轴运动，一行文字打印当前帧。

<details>
<summary><b>显示代码</b></summary>

```rust
impl Video for HelloWorldVideo<'_> {
    const FPS: usize = 30;
    const WIDTH: usize = 1920;
    const HEIGHT: usize = 1080;

    fn duration(&self) -> fframes::Duration<'_> {
        fframes::Duration::Seconds(30.)
    }

    fn audio(&self) -> AudioMap<'_> {
        AudioMap::none()
    }

    fn render_frame(&self, frame: Frame, ctx: &FFramesContext) -> fframes::Svgr<'_> {
        fframes::svgr!(
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1920 1080"
                width={ctx.current_video_size.width}
                height={ctx.current_video_size.height}
            >
                <rect
                    x="400"
                    y="400"
                    width="200"
                    height="200"
                    fill="blue"
                    transform={frame.animate(fframes::timeline!(
                        at 0., animate Transform::translate(0, 0) => Transform::translate(200, 480), Easing::Linear,
                        at 2. => 6.0, animate Transform::translate(200, 480) => Transform::translate(750, -400), Easing::Linear,
                        at 6.0 => 10.0, animate Transform::translate(750, -400) => Transform::translate(1310, 480), Easing::Linear,
                    ))}
                />

                <text
                    x="100"
                    y="440"
                    font-family="JetBrains Mono"
                    font-size="74"
                    font-weight="500"
                    fill="#3b5563"
                >
                    {format!("This frame index: {}, second: {:.2}", frame.index, frame.seconds())}
                </text>
            </svg>
        )
    }
}
```

</details>

这个 skill 的指南是纯 Markdown，作为人类也很值得一读：
[工作流](https://github.com/dmtrKovalenko/fframes/blob/main/skills/fframes-video/SKILL.md)、[API 速查表](https://github.com/dmtrKovalenko/fframes/blob/main/skills/fframes-video/references/api.md)、
[设计](https://github.com/dmtrKovalenko/fframes/blob/main/skills/fframes-video/references/design.md) 和 [声音](https://github.com/dmtrKovalenko/fframes/blob/main/skills/fframes-video/references/audio.md)。
完整的 API 参考在 [docs.rs/fframes](https://docs.rs/fframes)。

## 示例

| 示例 | 简介 |
| --- | --- |
| [fframes-intro](https://github.com/dmtrKovalenko/fframes/tree/main/examples/fframes-intro) | 那段 128 秒的发布视频，所有内容都对齐其音轨的节拍网格 |
| [signal-lab](https://github.com/dmtrKovalenko/fframes/tree/main/examples/signal-lab) | 一段 24 秒的运动研究：产品 UI、数据叙事与技术讲解 |
| [motion-graphics](https://github.com/dmtrKovalenko/fframes/tree/main/examples/motion-graphics) | 弹簧"突入"运动，以及适配其文本框宽度的等宽字体文字 |
| [shaders](https://github.com/dmtrKovalenko/fframes/tree/main/examples/shaders) | 与 SVG 组合的 GPU 着色器图层：一个 SkSL 背景，以及一个被裁剪进卡片的 Shadertoy 光线步进器 |
| [neon-triangle](https://github.com/dmtrKovalenko/fframes/tree/main/examples/neon-triangle) | 一段极简着色器短片，便于观察色带和运动伪影 |
| [hello-world](https://github.com/dmtrKovalenko/fframes/tree/main/examples/hello-world) | 一个简单的"hello world"视频 |
| [beta](https://github.com/dmtrKovalenko/fframes/tree/main/examples/beta) | 一个复杂的多场景示例（我们的 beta 发布视频） |
| [marketing](https://github.com/dmtrKovalenko/fframes/tree/main/examples/marketing) | 我们的营销视频 |
| [audio-announce](https://github.com/dmtrKovalenko/fframes/tree/main/examples/audio-announce) | 一个自动化工作流，生成带自动字幕的音频可视化 |
| [podcast](https://github.com/dmtrKovalenko/fframes/tree/main/examples/podcast) | 一期播客占位视频的音频可视化 |
| [teej-podcast](https://github.com/dmtrKovalenko/fframes/tree/main/examples/teej-podcast) | teej 的播客，带视频和章节可视化 |
| [tiktok](https://github.com/dmtrKovalenko/fframes/tree/main/examples/tiktok) | 一个类 TikTok 的竖屏视频 |
| [conference-splash-screen](https://github.com/dmtrKovalenko/fframes/tree/main/examples/conference-splash-screen) | 每个会议演讲一张启动屏，批量渲染 |
| [low-poly-art](https://github.com/dmtrKovalenko/fframes/tree/main/examples/low-poly-art) | 渲染器压力测试：大量多边形的动物图形 |
| [pixel-memory](https://github.com/dmtrKovalenko/fframes/tree/main/examples/pixel-memory) | 我狗狗的纪念视频生成器（完全随机） |

在仓库根目录，`just run podcast` 会在编辑器中以热重载打开一个示例，`just render podcast` 把它写到文件里。

## 不用 agent 也行

```sh
cargo install --locked cargo-fframes
cargo fframes new my-video
cd my-video && cargo run --release -- preview
```

`cargo fframes new` 支持 `--template single-scene|multi-scene`、`--format landscape|portrait|square|uhd`、`--fps`、`--title` 和 `--backend`。在 macOS 和 Linux（arm64、x86_64）上，首次构建会下载预编译的 Skia 和 ffmpeg 库，在性能较好的机器上不到一分钟；其他目标与特性组合则需从源码编译（最多约 20 分钟）。后续构建只需数秒。`--backend cpu` 会跳过 Skia（无预览窗口，渲染更慢）。要跟踪 `main` 分支，用 `--git https://github.com/dmtrKovalenko/fframes` 安装。

## 环境要求

[Rust](https://www.rust-lang.org/learn/get-started)，以及在开发编辑器时需要的 [NodeJS](https://nodejs.org/en/download/)。
fframes 静态链接 ffmpeg 的 libav 库。macOS 和 Linux（arm64 与 x86_64）会下载预编译构建，其他目标或设置了 `FFMPEG_FORCE_BUILD=1` 时则从源码编译；无论哪种情况，它们所链接的系统编码器都必须已安装。

示例在非 Windows 的原生目标上启用了 `fframes/build-portable`。CI 会构建整个工作区，组合示例的 x264、x265、VPX 和 Opus 特性；目前没有已发布的 FFmpeg 归档匹配这一组合，因此会回退到源码构建。不使用 `build-portable` 时，该构建会使用 `-march=native -mtune=native`。把它缓存后在一个不同 CPU 的 runner 上恢复，可能引发 `SIGILL`（非法指令）。该特性在源码构建中省略这些标志，同时保留匹配的预编译下载，并且也适用于编译期媒体宏所用的 FFmpeg。

在本工作区内，对将被缓存或在其他机器上运行的原生构建，请使用相同的设置：

```toml
[target.'cfg(not(any(target_arch = "wasm32", windows)))'.dependencies]
fframes = { workspace = true, features = ["build-portable"] }
```

`build-portable` 还启用了 FFmpeg 的源码构建支持，因此示例排除了 Windows（它链接共享的 FFmpeg 安装）和浏览器目标。设置 `FFMPEG_MARCH` 或 `FFMPEG_MTUNE`（即使是空字符串）会绕过预编译下载；如果你想要可移植的源码回退与预编译下载，优先使用这个特性。

<details>
<summary><b>macOS</b></summary>

```sh
brew install pkg-config ffmpeg x264 x265 opus nasm ninja
```

</details>

<details>
<summary><b>Linux</b></summary>

debian 系发行版：
```sh
sudo apt-get install -y yasm nasm ffmpeg libx264-dev libx265-dev libopus-dev libclang-dev clang ninja-build libvpx-dev libasound2-dev
```

arch 系发行版：
```sh
sudo pacman -S ninja yasm nasm ffmpeg x264 x265 opus clang
```

nix 用户：
```sh
nix-shell
```

</details>

<details>
<summary><b>Windows</b></summary>

在 Windows 上，ffmpeg 不从源码编译。fframes 改为链接一个预编译的 **FFmpeg 9.0** 共享构建
（例如来自 [BtbN/FFmpeg-Builds](https://github.com/BtbN/FFmpeg-Builds/releases/tag/latest) 的 `ffmpeg-n9.0-latest-win64-gpl-shared-9.0.zip`），
并且需要 LLVM 供 bindgen 使用：

```powershell
winget install LLVM.LLVM
# 把 ffmpeg 构建解压到某处，然后让构建指向它：
$env:FFMPEG_DIR = "C:\ffmpeg-n9.0-latest-win64-gpl-shared-9.0"
$env:LIBCLANG_PATH = "C:\Program Files\LLVM\bin"
# ffmpeg 的 DLL 在构建时（过程宏会加载它们）和运行时都必须可被找到
$env:PATH = "$env:FFMPEG_DIR\bin;$env:PATH"
```

也可以用 `vcpkg install ffmpeg` 代替 `FFMPEG_DIR`。编解码器来自预编译构建，因此请把编解码器特性
（`h264`、`h265`、……）关掉：它们会要求从源码构建 ffmpeg，而 Windows 上不支持这种方式。

</details>

<details>
<summary><b>Codecs</b></summary>

`fframes` crate 的 Cargo 特性决定链接哪些编解码器和硬件加速库：

```toml
[dependencies]
# 这会启用并尝试在构建时链接 libx264
fframes = { version = "1", features = ["h264", "libav-agree-gpl"] }
```

编解码器和其他系统库的全部构建与链接都借助 ffmpeg 的构建系统，因此排错时请参考
[ffmpeg 编译指南](https://trac.ffmpeg.org/wiki/CompilationGuide)。

</details>

<details>
<summary><b>Troubleshooting</b></summary>

- **构建在 `ffmpeg-sys-fframes` 处失败：** 上面列表中的某个系统库缺失（`nasm`、`pkg-config`、各编解码器包）。
- **Skia 绑定的构建因 bindgen 或 libclang 错误而失败**（仅当 Skia 从源码编译时，例如同时启用 `metal` 和 `vulkan`）：把 `LIBCLANG_PATH` 指向可用的 libclang；macOS 上 Xcode 的地址为：`export LIBCLANG_PATH=$(xcode-select -p)/Toolchains/XcodeDefault.xctoolchain/usr/lib`。
- **文字渲染成了错误的字体：** `inspect` 报告 `No match for ... font-family`；把字体文件放进项目的 `media/` 文件夹，并使用其准确的字族名。

</details>

## 参与开发 fframes

开发 fframes 本身的 agent 应从 [AGENTS.md](https://github.com/dmtrKovalenko/fframes/blob/main/AGENTS.md) 开始。对人类开发者，请安装
[just](https://github.com/casey/just) 命令运行器并初始化仓库：

```bash
npm install --global pnpm # 编辑器基于 nodejs，这是它的包管理器
cargo install --locked just cargo-watch wasm-bindgen-cli wasm-pack
just init-repo
just watch-editor # 在另一个终端中运行，用于开发编辑器
```

## 许可证

fframes 以 [MIT 许可证](https://github.com/dmtrKovalenko/fframes/blob/main/LICENSE.txt) 发布。
