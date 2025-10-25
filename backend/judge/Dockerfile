FROM openjdk:17-slim

# Install required packages
RUN apt-get update && apt-get install -y \
    coreutils \
    gcc \
    g++ \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -s /bin/bash runner

# Set working directory
WORKDIR /workspace

# Copy entrypoint script
COPY run.sh /usr/local/bin/run.sh
RUN chmod +x /usr/local/bin/run.sh

# Switch to non-root user
USER runner

# Set entrypoint
ENTRYPOINT ["/usr/local/bin/run.sh"]
