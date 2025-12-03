{
  description = "Arc MCP - Browser automation for Arc via MCP";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = {
    self,
    nixpkgs,
    ...
  }: let
    systems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f system);
  in {
    packages = forAllSystems (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      # Simple derivation that uses pre-built dist files
      arc-mcp = pkgs.stdenv.mkDerivation {
        pname = "arc-mcp-server";
        version = "2.0.0";

        src = ./.;

        nativeBuildInputs = [pkgs.nodejs];

        # Dist files are already committed, just install
        dontBuild = true;

        installPhase = ''
          mkdir -p $out/lib $out/bin

          # Copy source and built files
          cp -r packages index.js package.json $out/lib/

          # Create wrapper
          cat > $out/bin/arc-mcp-server <<EOF
#!/usr/bin/env bash
exec ${pkgs.nodejs}/bin/node $out/lib/index.js "\$@"
EOF
          chmod +x $out/bin/arc-mcp-server
        '';

        meta = {
          description = "MCP server for Arc browser automation";
          homepage = "https://github.com/andrewgazelka/arc-mcp";
          license = pkgs.lib.licenses.mit;
          mainProgram = "arc-mcp-server";
        };
      };
    in {
      default = arc-mcp;
    });

    apps = forAllSystems (system: {
      default = {
        type = "app";
        program = "${self.packages.${system}.default}/bin/arc-mcp-server";
      };
    });

    devShells = forAllSystems (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs
          nodePackages.typescript
        ];
      };
    });
  };
}
