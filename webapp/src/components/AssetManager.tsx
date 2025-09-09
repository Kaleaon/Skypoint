import React, { useState, useEffect } from 'react'

interface AssetItem {
  id: string
  type: 'texture' | 'geometry' | 'animation' | 'sound'
  name: string
  size: number
  cached: boolean
  loading: boolean
}

export const AssetManager: React.FC = () => {
  const [assets, setAssets] = useState<AssetItem[]>([])
  const [cacheStats, setCacheStats] = useState({
    totalSize: 0,
    itemCount: 0,
    hitRate: 85.2
  })

  useEffect(() => {
    // Simulate asset loading
    const mockAssets: AssetItem[] = [
      {
        id: 'tex_001',
        type: 'texture',
        name: 'avatar_skin.j2c',
        size: 2048,
        cached: true,
        loading: false
      },
      {
        id: 'geo_001', 
        type: 'geometry',
        name: 'prim_cube.mesh',
        size: 1024,
        cached: true,
        loading: false
      },
      {
        id: 'anim_001',
        type: 'animation',
        name: 'walk_cycle.anim',
        size: 512,
        cached: false,
        loading: true
      },
      {
        id: 'snd_001',
        type: 'sound',
        name: 'ambient_wind.ogg',
        size: 4096,
        cached: true,
        loading: false
      }
    ]

    setAssets(mockAssets)
    setCacheStats({
      totalSize: mockAssets.reduce((sum, asset) => sum + (asset.cached ? asset.size : 0), 0),
      itemCount: mockAssets.filter(asset => asset.cached).length,
      hitRate: 85.2
    })

    // Simulate loading completion
    const timer = setTimeout(() => {
      setAssets(prev => prev.map(asset => 
        asset.id === 'anim_001' 
          ? { ...asset, loading: false, cached: true }
          : asset
      ))
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'texture': return '🖼️'
      case 'geometry': return '📦'
      case 'animation': return '🎭'
      case 'sound': return '🔊'
      default: return '📄'
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const clearCache = () => {
    setAssets(prev => prev.map(asset => ({ ...asset, cached: false })))
    setCacheStats({ totalSize: 0, itemCount: 0, hitRate: 0 })
  }

  const loadAsset = (id: string) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id 
        ? { ...asset, loading: true }
        : asset
    ))

    setTimeout(() => {
      setAssets(prev => prev.map(asset => 
        asset.id === id 
          ? { ...asset, loading: false, cached: true }
          : asset
      ))
    }, 2000)
  }

  return (
    <div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', color: '#4ecdc4' }}>{cacheStats.itemCount}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Cached Items</div>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', color: '#4ecdc4' }}>{formatSize(cacheStats.totalSize)}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Cache Size</div>
        </div>
        
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', color: '#4ecdc4' }}>{cacheStats.hitRate}%</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Hit Rate</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Asset Cache</h3>
        <button 
          onClick={clearCache}
          style={{
            padding: '0.5rem 1rem',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Clear Cache
        </button>
      </div>

      <div className="asset-demo">
        {assets.map((asset) => (
          <div key={asset.id} className="asset-item">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>
                {getAssetIcon(asset.type)}
              </span>
              <strong>{asset.name}</strong>
            </div>
            
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.5rem' }}>
              Type: {asset.type} | Size: {formatSize(asset.size)}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                {asset.loading && (
                  <span style={{ color: '#ffc107' }}>⏳ Loading...</span>
                )}
                {!asset.loading && asset.cached && (
                  <span style={{ color: '#4caf50' }}>✅ Cached</span>
                )}
                {!asset.loading && !asset.cached && (
                  <span style={{ color: '#f44336' }}>❌ Not Cached</span>
                )}
              </div>
              
              {!asset.cached && !asset.loading && (
                <button
                  onClick={() => loadAsset(asset.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '0.7rem'
                  }}
                >
                  Load
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
        <strong>Note:</strong> This demonstrates browser-based asset caching using IndexedDB or localStorage. 
        The Android version uses direct file system access for more efficient caching.
      </div>
    </div>
  )
}