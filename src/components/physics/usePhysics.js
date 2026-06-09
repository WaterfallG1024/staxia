import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export function usePhysics(settings) {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const [bodiesMap, setBodiesMap] = useState(new Map()); // id -> body

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Engine setup
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    
    // 設定に基づく重力の適用
    engine.gravity.y = settings.gravity;

    // 2. Render setup (マウス操作用の当たり判定用透明Canvas)
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: 'transparent',
      }
    });
    // Canvasは見えないようにするが、イベントは受け取る
    render.canvas.style.opacity = '0';
    render.canvas.style.position = 'absolute';
    render.canvas.style.top = '0';
    render.canvas.style.left = '0';
    render.canvas.style.zIndex = '10';
    renderRef.current = render;

    // 3. 画面の境界 (壁・床)
    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;
    const wallOptions = { isStatic: true, render: { visible: false } };
    
    Matter.World.add(engine.world, [
      Matter.Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions), // 床
      Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOptions), // 左壁
      Matter.Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions), // 右壁
      // 天井は開けておく
    ]);

    // 4. マウス操作の追加
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // 5. Runner開始
    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // リサイズハンドリング
    const handleResize = () => {
      if (!sceneRef.current || !renderRef.current) return;
      const newWidth = sceneRef.current.clientWidth;
      const newHeight = sceneRef.current.clientHeight;
      renderRef.current.canvas.width = newWidth;
      renderRef.current.canvas.height = newHeight;
      renderRef.current.options.width = newWidth;
      renderRef.current.options.height = newHeight;
      // 床の位置を更新
      const floor = engine.world.bodies.find(b => b.isStatic && b.position.y > height - 100);
      if (floor) {
        Matter.Body.setPosition(floor, { x: newWidth / 2, y: newHeight + 25 });
        // TODO: 右壁の位置更新など
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world);
        Matter.Engine.clear(engineRef.current);
      }
      render.canvas.remove();
    };
  }, []); // 初回のみ実行

  // 外部から設定が変わった場合（重力、速度など）
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.gravity.y = settings.gravity;
    }
    if (runnerRef.current) {
      // 速度の調整 (デフォルトは 1000 / 60 ≒ 16.666)
      // deltaは固定せず、エンジンのtiming.timeScaleを変更するのが確実
      engineRef.current.timing.timeScale = settings.speed;
    }
  }, [settings]);

  // Bodyの追加関数
  const addTaskBody = (task, x, y) => {
    if (!engineRef.current) return null;
    
    // 重要度に基づくサイズと質量
    const sizeBase = 80 + (task.importance * 10); // min 90, max 180
    const width = sizeBase;
    const height = sizeBase * 0.4;
    
    const body = Matter.Bodies.rectangle(x, y, width, height, {
      restitution: 0.6, // 反発力
      friction: 0.1,    // 摩擦
      density: 0.001 * task.importance, // 密度（質量に影響）
      render: { visible: false } // 描画はReact側で行う
    });
    
    // カスタムプロパティとしてタスクID等を保持
    body.taskId = task.id;
    body.width = width;
    body.height = height;

    Matter.World.add(engineRef.current.world, body);
    
    setBodiesMap(prev => {
      const newMap = new Map(prev);
      newMap.set(task.id, body);
      return newMap;
    });

    return body;
  };

  const removeTaskBody = (taskId) => {
    if (!engineRef.current) return;
    const body = bodiesMap.get(taskId);
    if (body) {
      Matter.World.remove(engineRef.current.world, body);
      setBodiesMap(prev => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });
    }
  };

  return { sceneRef, engineRef, bodiesMap, addTaskBody, removeTaskBody };
}
