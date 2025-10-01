using VereinsApi.DTOs.Mitglied;

namespace VereinsApi.Models;

/// <summary>
/// Family tree structure model
/// </summary>
public class FamilyTree
{
    public MitgliedDto RootMember { get; set; } = null!;
    public List<FamilyTreeNode> Parents { get; set; } = new();
    public List<FamilyTreeNode> Children { get; set; } = new();
    public List<FamilyTreeNode> Siblings { get; set; } = new();
    public int TotalRelatives { get; set; }
    public int MaxDepthReached { get; set; }
}

/// <summary>
/// Family tree node model
/// </summary>
public class FamilyTreeNode
{
    public MitgliedDto Member { get; set; } = null!;
    public string RelationshipType { get; set; } = string.Empty;
    public int RelationshipTypeId { get; set; }
    public DateTime? RelationshipStart { get; set; }
    public DateTime? RelationshipEnd { get; set; }
    public bool IsActive { get; set; }
    public int Depth { get; set; }
    public List<FamilyTreeNode> Children { get; set; } = new();
}

/// <summary>
/// Family statistics model
/// </summary>
public class FamilyStatistics
{
    public int TotalRelationships { get; set; }
    public int ActiveRelationships { get; set; }
    public int InactiveRelationships { get; set; }
    public int AsChildRelationships { get; set; }
    public int AsParentRelationships { get; set; }
    public int TotalChildren { get; set; }
    public int TotalParents { get; set; }
    public int TotalSiblings { get; set; }
    public Dictionary<int, int> RelationshipsByType { get; set; } = new();
    public Dictionary<int, int> RelationshipsByStatus { get; set; } = new();
}
