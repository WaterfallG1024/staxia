import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { Slider } from '../components/ui/Slider';

export default function Setting() {
  const { settings, updateSetting } = useAppContext();

  return (
    <div className="p-6 md:p-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-slate-500">Customize your physics experience.</p>
        </div>

        <Card className="border-none shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Physics Engine</CardTitle>
            <CardDescription>Adjust how tasks behave in the Stack view.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Gravity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Gravity Strength: {settings.gravity.toFixed(1)}x
                </label>
              </div>
              <Slider 
                min={0.1} 
                max={3.0} 
                step={0.1} 
                value={[settings.gravity]} 
                onValueChange={([val]) => updateSetting('gravity', val)}
              />
            </div>

            {/* Speed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Time Scale (Speed): {settings.speed.toFixed(1)}x
                </label>
              </div>
              <Slider 
                min={0.5} 
                max={2.0} 
                step={0.1} 
                value={[settings.speed]} 
                onValueChange={([val]) => updateSetting('speed', val)}
              />
            </div>

            {/* Animation Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <label className="text-base font-medium">Entrance Animations</label>
                <p className="text-sm text-slate-500">Play animations when tasks are added.</p>
              </div>
              <Switch 
                checked={settings.animation} 
                onCheckedChange={(checked) => updateSetting('animation', checked)}
              />
            </div>

            {/* Rich Mode Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <label className="text-base font-medium">Rich UI Mode</label>
                <p className="text-sm text-slate-500">Enable advanced styling for physics blocks.</p>
              </div>
              <Switch 
                checked={settings.mode === 'rich'} 
                onCheckedChange={(checked) => updateSetting('mode', checked ? 'rich' : 'light')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
