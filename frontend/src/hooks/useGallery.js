import { useState } from 'react';

/**
 * useGallery — manages the image gallery lightbox for the Projects section.
 * Refactored to support dynamic project data directly from the API.
 */
export const useGallery = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProject, setCurrentProject] = useState(null);

  const openGallery = (project, startIndex = 0) => {
    if (!project || !project.images || project.images.length === 0) return;
    setIsGalleryOpen(true);
    setCurrentImageIndex(startIndex);
    setCurrentProject(project);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    setCurrentImageIndex(0);
    setCurrentProject(null);
  };

  const nextImage = () => {
    if (currentProject && currentProject.images) {
      setCurrentImageIndex((prev) =>
        prev === currentProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (currentProject && currentProject.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? currentProject.images.length - 1 : prev - 1
      );
    }
  };

  return {
    isGalleryOpen,
    currentImageIndex,
    currentProject,
    openGallery,
    closeGallery,
    nextImage,
    prevImage,
    setCurrentImageIndex,
  };
};
