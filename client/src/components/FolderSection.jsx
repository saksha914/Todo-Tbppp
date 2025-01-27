import { foldersData } from '../data/dummyData'

const FolderSection = () => {
  return (
    <div className="folder-section">
      <div className="section-header">
        <h2>Folders</h2>
        <button className="view-all">All &gt;</button>
      </div>
      
      <div className="folders-grid">
        {foldersData.map((folder) => (
          <div 
            key={folder.id} 
            className="folder-card"
            style={{ backgroundColor: folder.color }}
          >
            <div className="folder-icon">📁</div>
            <span className="folder-name">{folder.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FolderSection 