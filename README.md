# NUP Robotics Lab Website

This repository contains the source code for the NUP Robotics Lab website, built with Jekyll.

## Local Setup Instructions (Ubuntu)

Follow these steps to set up and run the website locally on an Ubuntu system.

### Prerequisites

First, you need to install Ruby, Bundler, and other necessary development tools.

1.  **Update package lists:**
    ```bash
    sudo apt update
    ```

2.  **Install Ruby and build essentials:**
    ```bash
    sudo apt install ruby-full build-essential zlib1g-dev -y
    ```

3.  **Configure RubyGems environment variables:**
    This step ensures that RubyGems installs gems into your home directory, avoiding permission issues and the need for `sudo` when installing gems. Add the following lines to your `~/.bashrc` file (or `~/.zshrc` if you're using Zsh):

    ```bash
    echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
    echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
    echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
    source ~/.bashrc
    ```
    After adding the lines, either close and reopen your terminal, or run `source ~/.bashrc` to apply the changes.

4.  **Install Bundler:**
    Bundler manages Ruby gem dependencies for your project.
    ```bash
    gem install bundler
    ```

### Project Setup

1.  **Navigate to the project directory:**
    Change your current directory to the root of the Jekyll project. This is the folder containing `_config.yml`, `_layouts/`, `_includes/`, etc.
    ```bash
    cd /path/to/site
    ```

2.  **Install Project Dependencies:**
    With the `Gemfile` in place, install all project-specific gems using Bundler:
    ```bash
    bundle install
    ```
    This command reads the `Gemfile` and installs all required gems into an isolated environment for this project.

### Running the Local Server

Once all dependencies are installed, you can start the Jekyll development server:

```bash
bundle exec jekyll serve 
```

### Viewing the Website

After running the jekyll serve command, the terminal will display the local address where the site is accessible. It usually looks like this:

Server address: [http://127.0.0.1:4000/](http://127.0.0.1:4000/)
Open your web browser and navigate to the displayed address (e.g., http://127.0.0.1:4000/). You should now see the "NUP Robotics Lab" website running locally.


## Adding a New Project

1. Create a new Markdown file (.md) inside the ```_projects/``` directory.
2. The filename should be descriptive of the project (e.g., new_awesome_project.md). 
3. At the top of the file, add the YAML Front Matter with the following structure:
```yaml
---
layout: project-detail
name: "Your Project Name" # This 'name' directly influences the URL. E.g., "My Great Project" becomes /projects/my-great-project/
image: "/assets/img/projects/your_image.jpg" # Path to your project image
description: "A brief description of the project for the card view."
tags:
    - "Tag1"
    - "Tag2"
---
```
4. Below the Front Matter, add the full description of your project using Markdown.

5. Save the file. The new project will automatically be included in the projects list on the website.

_You can add a new school or a new blog post in the same way. Use ```_schools/``` or ```_blog``` directory respectively._

### Adding a New Team Member

Open the ```about.md``` file located in the root directory of the project.

Find the team_members: section (for human team members) or robo_team: section (for robot team members) within the YAML Front Matter.

Add a new entry to the respective list, ensuring correct indentation:

```yaml

team_members:
  # ... existing team members ...
  - name: "New Member Name"
    image: "/assets/img/team/your_photo.jpg" # Path to the member's photo, aim for a 3:4 aspect ratio
    description: "Position or brief description.<br><a href='link'>GitHub/Homepage</a>" # You can use HTML here
    
```
or for robo team:

```yaml

robo_team:
  # ... existing robots ...
  - name: "New Robot Name"
    image: "/assets/img/robots/your_robot_photo.jpg" # Path to the robot's image
    description: "Brief description or link.<br><a href='link'>Website/Documentation</a>"
    fit_style: "contain" # Add if you need the image to fit within its container

```

## Adding a New Publication to the Research Page

1. Open the ```research.md``` file located in the root directory of the project.
2. Locate the publications: section within the YAML Front Matter.
3. Inside the publications: section, you will find subsections organized by year (e.g., 2024: or in_progress:). Add a new entry under the appropriate year (or create a new year section if necessary), ensuring correct indentation:

```yaml
publications:
  # ... other years ...
  2025: # Example for a new year
    - authors: "Author Name 1, Author Name 2"
      name: "Title of Your New Publication"
      doi: "your_publication_doi_link" 
  in_progress: # Or add to the "In progress" section
    - authors: "New Author"
      name: "New Work In Progress"
```