/*CREATE VIEW TRIALS_BY_YEAR AS
SELECT YEAR([StudyFirstSubmitDate]) as year, count(*) as NUM 
FROM [ClinicalTrials].[dbo].[StatusModule] 
GROUP BY [StudyFirstSubmitDate]*/ 
/*

SELECT [TRIALS_BY_YEAR].year, 
SUM([TRIALS_BY_YEAR].NUM) AS num_trials 
FROM TRIALS_BY_YEAR GROUP BY [TRIALS_BY_YEAR].year;

SELECT [StudyType], count(*) as NUM 
FROM [ClinicalTrials].[dbo].[DesignModule] 
GROUP BY [StudyType] ORDER BY NUM DESC

SELECT [OverallStatus], count(*) as NUM
FROM [ClinicalTrials].[dbo].[StatusModule] 
GROUP BY [OverallStatus] ORDER BY NUM DESC

SELECT [Phase], count(*) as NUM 
FROM [ClinicalTrials].[dbo].[PhaseList] 
GROUP BY [Phase] ORDER BY NUM DESC

SELECT [LocationCountry], count(*) as NUM 
FROM [ClinicalTrials].[dbo].[Location] 
GROUP BY [LocationCountry] ORDER BY NUM DESC

SELECT [LeadSponsorName], count(*) as NUM 
FROM [ClinicalTrials].[dbo].[LeadSponsor] 
GROUP BY [LeadSponsorName] ORDER BY NUM DESC


SELECT  [StudyType], AVG(DATEDIFF(day, [StudyFirstSubmitDate], [LastUpdateSubmitDate])) AS AvgDurationInDays, count(*) as NumTrials
FROM [ClinicalTrials].[dbo].[ProtocolSection]
    INNER JOIN StatusModule
        ON [ClinicalTrials].[dbo].[ProtocolSection].[StatusModuleId] = [StatusModule].[Id]
    INNER JOIN DesignModule 
        ON [ClinicalTrials].[dbo].[ProtocolSection].[DesignModuleId] = [DesignModule].[Id]
GROUP BY [StudyType]
*/
/*

CREATE VIEW TRIALS_BY_YEAR_WITH_MESH_TERM AS
SELECT YEAR([StudyFirstSubmitDate]) as year, count(*) as NUM 
FROM [proba].[dbo].[Study]
	INNER JOIN [proba].[dbo].[ProtocolSection]
		ON [proba].[dbo].[Study].[ProtocolSectionId] = [ProtocolSection].[Id]
	INNER JOIN [proba].[dbo].[StatusModule]
		ON [proba].[dbo].[ProtocolSection].[StatusModuleId] = [StatusModule].[Id]
	INNER JOIN [proba].[dbo].[DerivedSection]
		ON [proba].[dbo].[Study].[DerivedSectionId] = [DerivedSection].[Id]
	INNER JOIN [proba].[dbo].[ConditionBrowseModule]
		ON [proba].[dbo].[DerivedSection].[ConditionBrowseModuleId] = [ConditionBrowseModule].[Id]
	INNER JOIN [proba].[dbo].[ConditionMesh]
		ON [proba].[dbo].[ConditionBrowseModule].[ConditionMeshListId] = [ConditionMesh].[ConditionMeshListId]
WHERE  [proba].[dbo].[ConditionMesh].[ConditionMeshTerm] LIKE '%' + 
(SELECT [Condition] FROM [proba].[dbo].[StatisticsSearches] WHERE id = ( SELECT MAX( id ) FROM [proba].[dbo].[StatisticsSearches])) + '%'
	GROUP BY YEAR([StudyFirstSubmitDate]);

CREATE VIEW STUDY_TYPE_NUM_WITH_MESH_TERM AS
SELECT [StudyType], count(*) as NUM 
FROM [proba].[dbo].[Study]
	INNER JOIN [proba].[dbo].[ProtocolSection]
		ON [proba].[dbo].[Study].[ProtocolSectionId] = [ProtocolSection].[Id]
	INNER JOIN [proba].[dbo].[DesignModule]
		ON [proba].[dbo].[ProtocolSection].[DesignModuleId] = [DesignModule].[Id]
	INNER JOIN [proba].[dbo].[DerivedSection]
		ON [proba].[dbo].[Study].[DerivedSectionId] = [DerivedSection].[Id]
	INNER JOIN [proba].[dbo].[ConditionBrowseModule]
		ON [proba].[dbo].[DerivedSection].[ConditionBrowseModuleId] = [ConditionBrowseModule].[Id]
	INNER JOIN [proba].[dbo].[ConditionMesh]
		ON [proba].[dbo].[ConditionBrowseModule].[ConditionMeshListId] = [ConditionMesh].[ConditionMeshListId]
WHERE  [proba].[dbo].[ConditionMesh].[ConditionMeshTerm] LIKE '%' + 
(SELECT [Condition] FROM [proba].[dbo].[StatisticsSearches] WHERE id = ( SELECT MAX( id ) FROM [proba].[dbo].[StatisticsSearches])) + '%'
GROUP BY [StudyType] 

CREATE VIEW OVERALL_STATUS_WITH_MESH_TERM AS
SELECT [OverallStatus], count(*) as NUM
FROM [proba].[dbo].[Study]
INNER JOIN [proba].[dbo].[ProtocolSection]
		ON [proba].[dbo].[Study].[ProtocolSectionId] = [ProtocolSection].[Id]
	INNER JOIN [proba].[dbo].[StatusModule]
		ON [proba].[dbo].[ProtocolSection].[StatusModuleId] = [StatusModule].[Id]
	INNER JOIN [proba].[dbo].[DerivedSection]
		ON [proba].[dbo].[Study].[DerivedSectionId] = [DerivedSection].[Id]
	INNER JOIN [proba].[dbo].[ConditionBrowseModule]
		ON [proba].[dbo].[DerivedSection].[ConditionBrowseModuleId] = [ConditionBrowseModule].[Id]
	INNER JOIN [proba].[dbo].[ConditionMesh]
		ON [proba].[dbo].[ConditionBrowseModule].[ConditionMeshListId] = [ConditionMesh].[ConditionMeshListId]
WHERE  [proba].[dbo].[ConditionMesh].[ConditionMeshTerm] LIKE '%' + 
(SELECT [Condition] FROM [proba].[dbo].[StatisticsSearches] WHERE id = ( SELECT MAX( id ) FROM [proba].[dbo].[StatisticsSearches])) + '%'
GROUP BY [OverallStatus]

CREATE VIEW PHASE_WITH_MESH_TERM AS
SELECT [Phase], count(*) as NUM 
FROM [proba].[dbo].[Study]
INNER JOIN [proba].[dbo].[ProtocolSection]
		ON [proba].[dbo].[Study].[ProtocolSectionId] = [ProtocolSection].[Id]
	INNER JOIN [proba].[dbo].[DesignModule]
		ON [proba].[dbo].[ProtocolSection].[DesignModuleId] = [DesignModule].[Id]
	INNER JOIN [proba].[dbo].[PhaseList]
		ON [proba].[dbo].[DesignModule].[PhaseListId] = [PhaseList].[Id]
	INNER JOIN [proba].[dbo].[DerivedSection]
		ON [proba].[dbo].[Study].[DerivedSectionId] = [DerivedSection].[Id]
	INNER JOIN [proba].[dbo].[ConditionBrowseModule]
		ON [proba].[dbo].[DerivedSection].[ConditionBrowseModuleId] = [ConditionBrowseModule].[Id]
	INNER JOIN [proba].[dbo].[ConditionMesh]
		ON [proba].[dbo].[ConditionBrowseModule].[ConditionMeshListId] = [ConditionMesh].[ConditionMeshListId]
WHERE  [proba].[dbo].[ConditionMesh].[ConditionMeshTerm] LIKE '%' + 
(SELECT [Condition] FROM [proba].[dbo].[StatisticsSearches] WHERE id = ( SELECT MAX( id ) FROM [proba].[dbo].[StatisticsSearches])) + '%'
GROUP BY [Phase] 

CREATE VIEW LOCATION_WITH_MESH_TERM AS
SELECT [LocationCountry], count(*) as NUM
FROM [proba].[dbo].[Study]
INNER JOIN [proba].[dbo].[ProtocolSection]
		ON [proba].[dbo].[Study].[ProtocolSectionId] = [ProtocolSection].[Id]
	INNER JOIN [proba].[dbo].[ContactsLocationsModule]
		ON [proba].[dbo].[ProtocolSection].[ContactsLocationsModuleId] = [ContactsLocationsModule].[Id]
	INNER JOIN [proba].[dbo].[Location]
		ON [proba].[dbo].[ContactsLocationsModule].[LocationListId] = [Location].[LocationListId]
	INNER JOIN [proba].[dbo].[DerivedSection]
		ON [proba].[dbo].[Study].[DerivedSectionId] = [DerivedSection].[Id]
	INNER JOIN [proba].[dbo].[ConditionBrowseModule]
		ON [proba].[dbo].[DerivedSection].[ConditionBrowseModuleId] = [ConditionBrowseModule].[Id]
	INNER JOIN [proba].[dbo].[ConditionMesh]
		ON [proba].[dbo].[ConditionBrowseModule].[ConditionMeshListId] = [ConditionMesh].[ConditionMeshListId]
WHERE  [proba].[dbo].[ConditionMesh].[ConditionMeshTerm] LIKE '%' + 
(SELECT [Condition] FROM [proba].[dbo].[StatisticsSearches] WHERE id = ( SELECT MAX( id ) FROM [proba].[dbo].[StatisticsSearches])) + '%'
GROUP BY [LocationCountry]

CREATE VIEW SPONSOR_WITH_MESH_TERM AS
SELECT [LeadSponsorName], count(*) as NUM 
FROM [proba].[dbo].[Study]
INNER JOIN [proba].[dbo].[ProtocolSection]
		ON [proba].[dbo].[Study].[ProtocolSectionId] = [ProtocolSection].[Id]
	INNER JOIN [proba].[dbo].[SponsorCollaboratorsModule]
		ON [proba].[dbo].[ProtocolSection].[SponsorCollaboratorsModuleId] = [SponsorCollaboratorsModule].[Id]
	INNER JOIN [proba].[dbo].[LeadSponsor]
		ON [proba].[dbo].[SponsorCollaboratorsModule].[LeadSponsorId] = [LeadSponsor].[Id]
	INNER JOIN [proba].[dbo].[DerivedSection]
		ON [proba].[dbo].[Study].[DerivedSectionId] = [DerivedSection].[Id]
	INNER JOIN [proba].[dbo].[ConditionBrowseModule]
		ON [proba].[dbo].[DerivedSection].[ConditionBrowseModuleId] = [ConditionBrowseModule].[Id]
	INNER JOIN [proba].[dbo].[ConditionMesh]
		ON [proba].[dbo].[ConditionBrowseModule].[ConditionMeshListId] = [ConditionMesh].[ConditionMeshListId]
WHERE  [proba].[dbo].[ConditionMesh].[ConditionMeshTerm] LIKE '%' + 
(SELECT [Condition] FROM [proba].[dbo].[StatisticsSearches] WHERE id = ( SELECT MAX( id ) FROM [proba].[dbo].[StatisticsSearches])) + '%'
GROUP BY [LeadSponsorName] 


CREATE VIEW DURATION_WITH_MESH_TERM AS
SELECT [StudyType], AVG(DATEDIFF(day, [StudyFirstSubmitDate], [LastUpdateSubmitDate])) AS AvgDurationInDays, count(*) as NUM
FROM [proba].[dbo].[Study]
INNER JOIN [proba].[dbo].[ProtocolSection]
		ON [proba].[dbo].[Study].[ProtocolSectionId] = [ProtocolSection].[Id]
	INNER JOIN [proba].[dbo].[StatusModule]
		ON [proba].[dbo].[ProtocolSection].[StatusModuleId] = [StatusModule].[Id]
	INNER JOIN [proba].[dbo].[DesignModule]
		ON [proba].[dbo].[ProtocolSection].[DesignModuleId] = [DesignModule].[Id]
	INNER JOIN [proba].[dbo].[DerivedSection]
		ON [proba].[dbo].[Study].[DerivedSectionId] = [DerivedSection].[Id]
	INNER JOIN [proba].[dbo].[ConditionBrowseModule]
		ON [proba].[dbo].[DerivedSection].[ConditionBrowseModuleId] = [ConditionBrowseModule].[Id]
	INNER JOIN [proba].[dbo].[ConditionMesh]
		ON [proba].[dbo].[ConditionBrowseModule].[ConditionMeshListId] = [ConditionMesh].[ConditionMeshListId]
WHERE  [proba].[dbo].[ConditionMesh].[ConditionMeshTerm] LIKE '%' + 
(SELECT [Condition] FROM [proba].[dbo].[StatisticsSearches] WHERE id = ( SELECT MAX( id ) FROM [proba].[dbo].[StatisticsSearches])) + '%'
GROUP BY [StudyType]
*/

/*
SELECT * from TRIALS_BY_YEAR_WITH_MESH_TERM ORDER BY NUM DESC FOR JSON AUTO;
SELECT * FROM LOCATION_WITH_MESH_TERM ORDER BY NUM DESC FOR JSON AUTO;
SELECT * FROM PHASE_WITH_MESH_TERM ORDER BY NUM DESC FOR JSON AUTO;
SELECT * FROM OVERALL_STATUS_WITH_MESH_TERM ORDER BY NUM DESC FOR JSON AUTO;
SELECT * FROM STUDY_TYPE_NUM_WITH_MESH_TERM ORDER BY NUM DESC FOR JSON AUTO;
SELECT * FROM SPONSOR_WITH_MESH_TERM ORDER BY NUM DESC FOR JSON AUTO;
SELECT * FROM DURATION_WITH_MESH_TERM ORDER BY NUM DESC FOR JSON AUTO;


SELECT sum(NUM)AS 'TRIALS_BY_YEAR_WITH_MESH_TERM' from TRIALS_BY_YEAR_WITH_MESH_TERM;
SELECT sum(NUM) AS 'PHASE_WITH_MESH_TERM' FROM PHASE_WITH_MESH_TERM;
SELECT sum(NUM) AS 'LOCATION_WITH_MESH_TERM' FROM LOCATION_WITH_MESH_TERM;
SELECT sum(NUM)AS 'OVERALL_STATUS_WITH_MESH_TERM' FROM OVERALL_STATUS_WITH_MESH_TERM;
SELECT sum(NUM)AS 'STUDY_TYPE_NUM_WITH_MESH_TERM' FROM STUDY_TYPE_NUM_WITH_MESH_TERM;
SELECT sum(NUM)AS 'SPONSOR_WITH_MESH_TERM' FROM SPONSOR_WITH_MESH_TERM;
SELECT sum(NumTrials)AS 'DURATION_WITH_MESH_TERM' FROM DURATION_WITH_MESH_TERM;

SELECT [Condition] FROM [proba].[dbo].[StatisticsSearches] WHERE id = ( SELECT MAX( id ) FROM [proba].[dbo].[StatisticsSearches])

*/
SELECT * from TRIALS_BY_YEAR_WITH_MESH_TERM
SELECT sum(NUM)AS 'TRIALS_BY_YEAR_WITH_MESH_TERM' from TRIALS_BY_YEAR_WITH_MESH_TERM;
