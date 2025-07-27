// frontend/src/app/assets/page.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/app/components/ui/Card'

export default function AssetListPage() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/assets')
      .then(res => setAssets(res.data))
      .catch(err => console.error('Failed to fetch assets:', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Asset List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset: any) => (
            <Card key={asset.id} className="shadow-md">
              <CardContent>
                <p><strong>Device:</strong> {asset.device_name}</p>
                <p><strong>Brand:</strong> {asset.brand}</p>
                <p><strong>Model:</strong> {asset.model}</p>
                <p><strong>Asset Type:</strong> {asset.asset_type}</p>
                <p><strong>Status:</strong> {asset.status}</p>
                <p><strong>Location:</strong> {asset.location}</p>
                {asset.user?.name && <p><strong>Assigned To:</strong> {asset.user.name}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
