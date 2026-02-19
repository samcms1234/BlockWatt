import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  Gateway,
  Wallets,
  Contract,
  Network,
  X509Identity,
} from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FabricService implements OnModuleInit {
  private contract: Contract;

  async onModuleInit(): Promise<void> {
    await this.init();
  }

  private async init(): Promise<void> {
    // Correct connection profile path
    const ccpPath = path.resolve(
      process.cwd(),
      'src',
      'blockchain',
      'connection.json',
    );

    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Wallet outside dist
    const walletPath = path.resolve(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get('admin');

    if (!identity) {
      const mspPath = path.resolve(
        process.cwd(),
        'src',
        'blockchain',
        'crypto',
        'Admin@org1.example.com',
        'msp',
      );

      // ✅ Correct certificate filename
      const cert = fs.readFileSync(
        path.join(
          mspPath,
          'signcerts',
          'Admin@org1.example.com-cert.pem',
        ),
      ).toString();

      // ✅ Your key file is named "priv_sk"
      const key = fs.readFileSync(
        path.join(mspPath, 'keystore', 'priv_sk'),
      ).toString();

      const x509Identity: X509Identity = {
        credentials: {
          certificate: cert,
          privateKey: key,
        },
        mspId: 'Org1MSP',
        type: 'X.509',
      };

      await wallet.put('admin', x509Identity);
    }

    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: 'admin',
      discovery: { enabled: true, asLocalhost: true }, // Docker mode
    });

    const network: Network = await gateway.getNetwork('blockwattchannel');
    this.contract = network.getContract('blockwatt');
  }

  async submitTransaction(fn: string, ...args: string[]): Promise<Buffer> {
    return this.contract.submitTransaction(fn, ...args);
  }

  async evaluateTransaction(fn: string, ...args: string[]): Promise<Buffer> {
    return this.contract.evaluateTransaction(fn, ...args);
  }
}
