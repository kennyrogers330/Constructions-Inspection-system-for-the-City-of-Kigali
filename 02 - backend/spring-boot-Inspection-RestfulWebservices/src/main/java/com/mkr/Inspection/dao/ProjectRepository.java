package com.mkr.Inspection.dao;

import com.mkr.Inspection.Entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.RequestParam;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);
    @Query("SELECT p FROM Project p WHERE p.project_type = :project_type")
    Page<Project> findByProjectType(@RequestParam("project_type") String project_type, Pageable pageable);
}
