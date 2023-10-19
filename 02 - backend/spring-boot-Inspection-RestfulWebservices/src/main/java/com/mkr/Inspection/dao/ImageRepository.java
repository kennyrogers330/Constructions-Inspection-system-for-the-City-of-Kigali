package com.mkr.Inspection.dao;

import com.mkr.Inspection.Entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}
