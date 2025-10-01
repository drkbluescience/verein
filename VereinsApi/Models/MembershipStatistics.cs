namespace VereinsApi.Models;

/// <summary>
/// Membership statistics model
/// </summary>
public class MembershipStatistics
{
    public int TotalMembers { get; set; }
    public int ActiveMembers { get; set; }
    public int InactiveMembers { get; set; }
    public int NewMembersThisMonth { get; set; }
    public int NewMembersThisYear { get; set; }
    public Dictionary<int, int> MembersByStatus { get; set; } = new();
    public Dictionary<int, int> MembersByType { get; set; } = new();
}
