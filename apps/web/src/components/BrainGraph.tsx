import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import * as THREE from 'three';

interface GraphData {
    nodes: any[];
    links: any[];
}

interface BrainGraphProps {
    scopeFilter?: string | null;
    resetTrigger?: number;
}

const BrainGraph = ({ scopeFilter, resetTrigger }: BrainGraphProps) => {
    const fgRef = useRef<ForceGraphMethods>();
    const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                // Build URL with optional scope filter
                const nodesUrl = scopeFilter
                    ? `http://127.0.0.1:8000/graph/nodes?limit=200&scope=${scopeFilter}`
                    : 'http://127.0.0.1:8000/graph/nodes?limit=200';

                // Fetch nodes and relationships in parallel
                const [nodesRes, linksRes] = await Promise.all([
                    fetch(nodesUrl),
                    fetch('http://127.0.0.1:8000/graph/relationships')
                ]);

                if (nodesRes.ok && linksRes.ok) {
                    const nodesData = await nodesRes.json();
                    const linksData = await linksRes.json();

                    // Map nodes to includes visual properties
                    const nodes = nodesData.nodes.map((node: any) => ({
                        ...node,
                        name: node.label,
                        val: 10,
                        color: getNodeColor(node.group)
                    }));

                    // Map links to source/target, filter to only include nodes in current set
                    const nodeIds = new Set(nodes.map((n: any) => n.id));
                    const links = linksData.relationships
                        .filter((rel: any) => nodeIds.has(rel.source) && nodeIds.has(rel.target))
                        .map((rel: any) => ({
                            source: rel.source,
                            target: rel.target,
                            type: rel.type
                        }));

                    setData({ nodes, links });
                }
            } catch (err) {
                console.error("Failed to load graph data:", err);
            }
        };

        fetchGraphData();
    }, [scopeFilter, resetTrigger]);

    const getNodeColor = (group: string) => {
        const colors: any = {
            'engineering': '#10b981',
            'personal': '#3b82f6',
            'research': '#a855f7',
            'strategy': '#f59e0b',
            'general': '#6366f1'
        };
        return colors[group.toLowerCase()] || '#6366f1';
    };

    const paintNode = useCallback((node: any) => {
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(node.val / 4),
            new THREE.MeshLambertMaterial({
                color: node.color,
                transparent: true,
                opacity: 0.8,
                emissive: node.color,
                emissiveIntensity: 0.5
            })
        );
        return sphere;
    }, []);

    return (
        <div className="w-full h-full relative sphere-container">
            <ForceGraph3D
                ref={fgRef}
                graphData={data}
                backgroundColor="rgba(0,0,0,0)"
                showNavInfo={false}
                nodeLabel={(node: any) => `<div class="bg-black/80 p-2 rounded border border-white/10 text-[10px]">${node.content}</div>`}
                nodeThreeObject={paintNode}
                nodeRelSize={4}
                linkWidth={0.5}
                linkColor={() => 'rgba(255,255,255,0.1)'}
                linkDirectionalParticles={1}
                linkDirectionalParticleSpeed={0.005}
                linkDirectionalParticleWidth={1}
                linkDirectionalParticleColor={() => '#3b82f6'}
                enableNodeDrag={true}
                onNodeClick={(node: any) => {
                    if (fgRef.current) {
                        const distance = 150;
                        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
                        fgRef.current.cameraPosition(
                            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                            node,
                            2000
                        );
                    }
                }}
            />
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,3,5,0.4)_100%)]" />
        </div>
    );
};

export default BrainGraph;
