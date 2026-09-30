/**
 * Every string on the page lives here so the copy can be audited in one place.
 * Facts come from the fframes README; nothing is invented.
 */

export const site = {
  name: 'fframes',
  title: 'fframes 用 Rust 和 SVG 写视频，在 GPU 上渲染',
  description:
    'fframes 是一个真正够快的视频氛围编程框架。用 Rust 写每一帧，用 SVG 描述画面，Skia 与 ffmpeg 在 GPU 上完成渲染。',
  lang: 'zh-CN',
  repo: 'https://github.com/dmtrKovalenko/fframes',
  docs: 'https://docs.rs/fframes',
  crates: 'https://crates.io/crates/fframes',
  x: 'https://x.com/fframes_rust',
  license: 'https://github.com/dmtrKovalenko/fframes/blob/main/LICENSE.txt',
  sponsor: 'https://github.com/sponsors/dmtrKovalenko',
  studio: 'https://fframes.studio',
} as const;

export const nav = [
  { label: '工作流', href: '#agent' },
  { label: '命令', href: '#commands' },
  { label: '速度', href: '#speed' },
  { label: '代码', href: '#code' },
  { label: '示例', href: '#examples' },
  { label: '安装', href: '#start' },
  { label: '环境', href: '#requirements' },
] as const;

/** Real values, read from the shields.io endpoints for this crate. */
export const releaseFacts = [
  { label: 'crates.io', value: 'v1.1.1-rc.0', href: site.crates },
  { label: 'docs.rs', value: 'passing', href: site.docs },
  { label: 'LICENSE', value: 'MIT', href: site.license },
  { label: 'X', value: '@fframes_rust', href: site.x },
] as const;

export const releaseVideo = {
  poster: '/launch-poster.jpg',
  width: 1280,
  height: 720,
  href: `${site.repo}/tree/main/examples/fframes-intro`,
  lead: '128 秒的发布视频，用氛围式编程写就花了 48 分钟，渲染花了 36 秒。',
  tail: '它是一个 fframes 项目：',
  name: 'examples/fframes-intro',
} as const;

export const skillDocs = [
  { label: '工作流', href: `${site.repo}/blob/main/skills/fframes-video/SKILL.md` },
  { label: 'API 速查表', href: `${site.repo}/blob/main/skills/fframes-video/references/api.md` },
  { label: '设计', href: `${site.repo}/blob/main/skills/fframes-video/references/design.md` },
  { label: '声音', href: `${site.repo}/blob/main/skills/fframes-video/references/audio.md` },
] as const;

export const readers = {
  intro: '编程 agent 无法观看视频，也听不到音轨。每个项目都自带一条命令行，把视频变成 agent 能读的东西：PNG、文本和数字。',
  agent: {
    heading: '你的 agent',
    items: [
      {
        title: '不渲染像素也能逐帧检查',
        body: 'inspect 会报告缺失的字体或图片、被画布裁切的文字、无效的 SVG 以及 panic，每一条都带着它的时间和场景。',
      },
      {
        title: '查看动效',
        body: 'strip 把等间距的帧平铺成一张联络表，onion 混合多帧来展示运动的路径与缓动，frame 写出全尺寸 PNG。',
      },
      {
        title: '测量声音',
        body: 'audio analyze 按场景报告响度（LUFS）、真实峰值、削波和静音。',
      },
    ],
  },
  human: {
    heading: '你',
    items: [
      {
        title: '带声音实时观看',
        body: 'preview 打开一个 GPU 窗口，可以播放、暂停、拖动定位并逐帧步进。',
      },
      {
        title: '在浏览器里拖着预览',
        body: '编辑器把视频编译为 WebAssembly 运行，并带一条时间轴。',
      },
      {
        title: '交付',
        body: 'render 写出最终文件；render --draft 以一半分辨率编码单个场景，约一秒完成。',
      },
    ],
  },
} as const;

export type CommandSpan = 'full' | 'half';
export type CommandTint = 'surface' | 'raised' | 'accent';

export interface CommandEntry {
  command: string;
  output: string;
  span: CommandSpan;
  tint: CommandTint;
}

/**
 * Order matters: the full width cell comes first so the eight half cells
 * always pair up and the grid never leaves an empty track.
 */
export const commands: readonly CommandEntry[] = [
  {
    command: 'inspect',
    output: '每 0.25 秒一帧中存在的问题，以及每个场景的首帧和末帧；出错时退出码为 2',
    span: 'full',
    tint: 'accent',
  },
  {
    command: 'timeline',
    output: '各场景及其帧范围、秒范围，以及每条音轨及其混音设置',
    span: 'half',
    tint: 'surface',
  },
  {
    command: 'audio analyze --waveform w.png',
    output: '响度报告，以及一张带有场景线和提示刻度的波形图',
    span: 'half',
    tint: 'raised',
  },
  {
    command: 'strip <scene> -n 12',
    output: 'strip.png，一张带标注的联络表',
    span: 'half',
    tint: 'surface',
  },
  {
    command: 'frame <scene>@end,<scene>@50%',
    output: 'frames/ 中的全尺寸 PNG',
    span: 'half',
    tint: 'surface',
  },
  {
    command: 'onion "<scene>@0..<scene>@1s" -n 6',
    output: 'onion.png，混合后的运动',
    span: 'half',
    tint: 'raised',
  },
  {
    command: 'snapshot',
    output: '与已批准 PNG 的对比，.diff.png 标出变化之处',
    span: 'half',
    tint: 'surface',
  },
  { command: 'preview', output: '实时窗口，给人类看', span: 'half', tint: 'surface' },
  { command: 'render [--draft]', output: '视频，或者它的一部分', span: 'half', tint: 'surface' },
];

export const commandNotes = [
  '每条命令都在项目内以 cargo run --release -- <command> 运行。',
  '<scene> 是你的视频中某个场景结构体的名字。时间可以写作 120（帧）、3.2s、50%、<scene>@1.2s，以及 <scene>@0..<scene>@1s 这样的范围。加上 --json 可得到可解析的输出。',
] as const;

export const stats = [
  { figure: '10×', label: 'Skia GPU 后端相对内置 CPU 后端的渲染加速' },
  { figure: '36s', label: '渲染 128 秒发布视频的耗时' },
  { figure: '48min', label: '用氛围式编程写完同一条视频的耗时' },
  { figure: '~1s', label: 'render --draft 编码单个场景的耗时' },
] as const;

export const reasons = [
  {
    title: 'GPU 负责绘制',
    body: ['Skia 后端在 Metal（macOS）或 Vulkan（Linux、Windows）上渲染，比内置的 CPU 后端快约 10 倍。'],
  },
  {
    title: '静态标记被缓存',
    body: ['一帧中没有 ', '{expressions}', ' 的部分会在编译期被哈希，并由渲染器复用。'],
  },
  {
    title: 'ffmpeg 负责编码',
    body: ['fframes 直接链接 ffmpeg 的 libav 库，而不是调用一个独立工具。'],
  },
  {
    title: 'SVG 不够用时用着色器',
    body: ['把 SkSL 或粘贴进来的 Shadertoy GLSL 作为任意一帧的一个图层来运行。'],
  },
] as const;

export const exampleCategories = [
  { id: 'all', label: '全部' },
  { id: 'showcase', label: '发布与品牌' },
  { id: 'motion', label: '动效与图形' },
  { id: 'shaders', label: '着色器' },
  { id: 'audio', label: '音频可视化' },
  { id: 'tools', label: '入门与工具' },
] as const;

export type ExampleCategory = (typeof exampleCategories)[number]['id'];
export type ExampleGroup = Exclude<ExampleCategory, 'all'>;

export interface ExampleEntry {
  name: string;
  group: ExampleGroup;
  body: string;
  /** The launch video carries the poster, so the grid is not fifteen flat cards. */
  poster?: string;
}

export const examples: readonly ExampleEntry[] = [
  {
    name: 'fframes-intro',
    group: 'showcase',
    body: '那段 128 秒的发布视频，所有内容都对齐它音轨的节拍网格。',
    poster: releaseVideo.poster,
  },
  {
    name: 'signal-lab',
    group: 'motion',
    body: '一段 24 秒的运动研究：产品 UI、数据叙事与技术讲解。',
  },
  {
    name: 'motion-graphics',
    group: 'motion',
    body: '弹簧“突入”运动，以及会适配文本框宽度的等宽字体文字。',
  },
  {
    name: 'shaders',
    group: 'shaders',
    body: '与 SVG 组合的 GPU 着色器图层：一个 SkSL 背景，和一个被裁剪进卡片的 Shadertoy 光线步进器。',
  },
  {
    name: 'neon-triangle',
    group: 'shaders',
    body: '一段极简着色器短片，便于观察色带和运动伪影。',
  },
  { name: 'hello-world', group: 'tools', body: '一个简单的“hello world”视频。' },
  {
    name: 'beta',
    group: 'showcase',
    body: '一个复杂的多场景示例，也就是我们的 beta 发布视频。',
  },
  { name: 'marketing', group: 'showcase', body: '我们的营销视频。' },
  {
    name: 'audio-announce',
    group: 'audio',
    body: '一个自动化工作流，生成带自动字幕的音频可视化。',
  },
  { name: 'podcast', group: 'audio', body: '一期播客占位视频的音频可视化。' },
  {
    name: 'teej-podcast',
    group: 'audio',
    body: 'teej 的播客，带视频和章节可视化。',
  },
  { name: 'tiktok', group: 'motion', body: '一个类 TikTok 的竖屏视频。' },
  {
    name: 'conference-splash-screen',
    group: 'tools',
    body: '每个会议演讲一张启动屏，批量渲染。',
  },
  {
    name: 'low-poly-art',
    group: 'shaders',
    body: '渲染器压力测试：大量多边形的动物图形。',
  },
  {
    name: 'pixel-memory',
    group: 'tools',
    body: '我狗狗的纪念视频生成器，完全随机。',
  },
];

export const exampleRepoBase = `${site.repo}/tree/main/examples`;

export const generatorFlags = [
  { flag: '--template', value: 'single-scene / multi-scene', body: '模板形态' },
  { flag: '--format', value: 'landscape / portrait / square / uhd', body: '画幅' },
  { flag: '--fps', value: '整数', body: '帧率' },
  { flag: '--title', value: '字符串', body: '写入项目标题' },
  { flag: '--backend', value: 'skia / cpu', body: 'cpu 会跳过 Skia，没有预览窗口，渲染更慢' },
  { flag: '--git', value: 'https://github.com/dmtrKovalenko/fframes', body: '跟踪 main 分支安装' },
] as const;

export const installBlocks = {
  macos: ['brew install pkg-config ffmpeg x264 x265 opus nasm ninja'],
  linuxDebian: [
    'sudo apt-get install -y yasm nasm ffmpeg libx264-dev libx265-dev libopus-dev libclang-dev clang ninja-build libvpx-dev libasound2-dev',
  ],
  linuxArch: ['sudo pacman -S ninja yasm nasm ffmpeg x264 x265 opus clang'],
  linuxNix: ['nix-shell'],
  windows: [
    'winget install LLVM.LLVM',
    '# 把 ffmpeg 构建解压到某处，然后让构建指向它：',
    '$env:FFMPEG_DIR = "C:\\ffmpeg-n9.0-latest-win64-gpl-shared-9.0"',
    '$env:LIBCLANG_PATH = "C:\\Program Files\\LLVM\\bin"',
    '# ffmpeg 的 DLL 在构建时和运行时都必须可被找到',
    '$env:PATH = "$env:FFMPEG_DIR\\bin;$env:PATH"',
  ],
  codecs: [
    '[dependencies]',
    '# 这会启用并尝试在构建时链接 libx264',
    'fframes = { version = "1", features = ["h264", "libav-agree-gpl"] }',
  ],
  portable: [
    "[target.'cfg(not(any(target_arch = \"wasm32\", windows)))'.dependencies]",
    'fframes = { workspace = true, features = ["build-portable"] }',
  ],
} as const;

export const troubleshooting = [
  {
    problem: '构建在 ffmpeg-sys-fframes 处失败',
    fix: '上面列表里缺少某个系统库：nasm、pkg-config，或各编解码器包。',
  },
  {
    problem: 'Skia 绑定的构建因 bindgen 或 libclang 报错',
    fix: '只有 Skia 从源码编译时才会发生，例如同时启用 metal 和 vulkan。把 LIBCLANG_PATH 指向一个可用的 libclang。',
  },
  {
    problem: '文字渲染成了错误的字体',
    fix: 'inspect 会报告 No match for ... font-family。把字体文件放进项目的 media/ 文件夹，并使用它准确的字族名。',
  },
] as const;

export const contributionSteps = [
  'npm install --global pnpm',
  'cargo install --locked just cargo-watch wasm-bindgen-cli wasm-pack',
  'just init-repo',
  'just watch-editor',
] as const;
