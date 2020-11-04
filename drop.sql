-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE <Drop, sysname, Drop> 
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    DECLARE @strSQLDrop Varchar(MAX) = '';
	DECLARE @strSQLConstraints Varchar(MAX) = '';

	SELECT @strSQLConstraints = @strSQLConstraints + 'ALTER TABLE' + QUOTENAME(name) + 'NOCHECK CONSTRAINT ALL; '
	  FROM sys.objects 
	  WHERE type = 'U'
	  AND name NOT IN ('Tags', 'TagLists', '__EFMigrationsHistory');

	SELECT @strSQLDrop = @strSQLDrop + 'DROP TABLE ' + QUOTENAME(name) + '; '
	  FROM sys.objects 
	  WHERE type = 'U'
	  AND name NOT IN ('Tags', 'TagLists', '__EFMigrationsHistory')
	  ORDER BY name;
END
	EXEC (@strSQLConstraints)
	EXEC (@strSQLDrop)
