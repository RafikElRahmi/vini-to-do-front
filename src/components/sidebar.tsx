"use client";

import { MODES } from "@/contexts/themes/themes";
import { useTheme } from "@/contexts/themes/useTheme";

function SideBar() {
    const { setModeTheme } = useTheme();
  return (
    <aside>
        <button className='btn-mode' onClick={()=>setModeTheme(MODES[0])}>Classic ligth</button>
        <button className='btn-mode' onClick={()=>setModeTheme(MODES[1])}>Classic dark</button>
        <button className='btn-mode' onClick={()=>setModeTheme(MODES[2])}>Fantasy light</button>
        <button className='btn-mode' onClick={()=>setModeTheme(MODES[3])}>Fantasy dark</button>
        <button className='btn-mode' onClick={()=>setModeTheme(MODES[4])}>Gaming red</button>
        <button className='btn-mode' onClick={()=>setModeTheme(MODES[5])}>Gaming green</button>
        <button className='btn-mode' onClick={()=>setModeTheme(MODES[6])}>Gaming bleu</button>
    
    </aside>
  );
}

export default SideBar;
